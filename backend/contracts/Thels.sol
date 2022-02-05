// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";
import "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import "@chainlink/contracts/src/v0.7/interfaces/AggregatorV3Interface.sol";

contract Thels is Ownable {
    using CFAv1Library for CFAv1Library.InitData;

    struct Token {
        address tokenAddress;
        AggregatorV3Interface priceFeed; // Chainlink price feed
        uint256 borrowPercent; // 100 => 10.0%
    }

    struct Stream {
        address receiver;
        int96 flowRate;
        uint256 start;
        uint256 end;
    }

    event AddedCollateral(
        address indexed borrower,
        address token,
        uint256 amount
    );
    event RemovedCollateral(
        address indexed borrower,
        address token,
        uint256 amount
    );
    event RepaidDebt(address indexed borrower, uint256 amount);
    event StartedStream(
        address indexed borrower,
        address receiver,
        Stream stream
    );
    event StoppedStream(
        address indexed borrower,
        address receiver,
        Stream stream
    );
    event AddedUSDC(address indexed lender, uint256 amount);
    event RemovedUSDC(address indexed lender, uint256 amount);

    uint256 public constant FEE = 50; // 50 => 5.0%

    mapping(address => mapping(address => uint256)) public collateralAmounts;
    mapping(address => mapping(address => Stream)) public streams;
    mapping(address => uint256) public depositAmounts;
    mapping(address => uint256) public debtAmounts;
    mapping(address => Token) public allowedTokens;
    address[] public deposited;
    address[] public allowedTokenList;
    IERC20 public USDCToken;
    ISuperToken public USDCxToken;
    CFAv1Library.InitData public cfaV1;

    constructor(
        address _USDCToken,
        address _USDCxToken,
        address _SuperfluidHost
    ) {
        USDCToken = IERC20(_USDCToken);
        USDCxToken = ISuperToken(_USDCxToken);
        ISuperfluid _host = ISuperfluid(_SuperfluidHost);
        // initialize InitData struct, and set equal to cfaV1
        cfaV1 = CFAv1Library.InitData(
            _host,
            // here, we are deriving the address of the CFA using the host contract
            IConstantFlowAgreementV1(
                address(
                    _host.getAgreementClass(
                        keccak256(
                            "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
                        )
                    )
                )
            )
        );

        // approve tokens for Superfluid contract
        USDCToken.approve(_USDCxToken, type(uint256).max);
    }

    // deposit an allowed token
    function deposit(address token, uint256 amount) public {
        require(
            allowedTokens[token].tokenAddress != address(0),
            "Token is not allowed as collateral."
        );
        require(
            //check if collateral is worth of deptAmounts
            getCollateralValue() < debtAmounts[token], //not sure if contract sets any value to debtAmount before 
            "Token is not worth of the debt"
        );
        IERC20 _token = IERC20(token);
        _token.transferFrom(msg.sender, address(this), amount);
        collateralAmounts[msg.sender][token] += amount;
        emit AddedCollateral(msg.sender, token, amount);
    }

    // withdraw deposited token
    function withdraw(address token, uint256 amount) public {
        require(
            allowedTokens[token].tokenAddress != address(0),
            "Token is not allowed as collateral."
        );
        require(
            collateralAmounts[msg.sender][token] >= amount,
            "Not enough balance."
        );
        require(
            getBorrowableAmount(msg.sender) >=
                (((getTokenPrice(allowedTokens[token]) * amount) / (10**21)) *
                    allowedTokens[token].borrowPercent +
                    debtAmounts[msg.sender]),
            "Cannot withdraw without paying debt."
        );
        IERC20 _token = IERC20(token);
        collateralAmounts[msg.sender][token] -= amount;
        _token.transfer(msg.sender, amount);
        emit RemovedCollateral(msg.sender, token, amount);
    }

    // repay debt
    function repay(uint256 amount) public {
        require(
            amount <= debtAmounts[msg.sender],
            "Cannot repay more than owed."
        );
        convertToUSDCx(amount);
        debtAmounts[msg.sender] -= amount;
        emit RepaidDebt(msg.sender, amount);
    }

    // start a stream to an address
    // receiver: receiving address
    // flowRate: amount of wei / second
    // endTime: unix timestamp of ending time
    function startStream(
        address receiver,
        int96 flowRate,
        uint256 endTime
    ) public {
        require(endTime > block.timestamp, "Cannot set end time to past.");
        require(
            streams[msg.sender][receiver].start == 0,
            "Stream already exists."
        );
        uint256 totalBorrow = uint256(flowRate) * (endTime - block.timestamp);
        require(
            addFee(totalBorrow) < getBorrowableAmount(msg.sender),
            "Cannot borrow more than allowed."
        );
        debtAmounts[msg.sender] += addFee(totalBorrow);
        streams[msg.sender][receiver] = Stream(
            receiver,
            flowRate,
            block.timestamp,
            endTime
        );
        cfaV1.createFlow(receiver, USDCxToken, flowRate);
        emit StartedStream(msg.sender, receiver, streams[msg.sender][receiver]);
    }

    // stop a previously opened stream and distribute fee rewards
    function stopStream(address receiver) public {
        require(
            streams[msg.sender][receiver].start != 0,
            "Stream does not exist."
        );
        cfaV1.deleteFlow(address(this), receiver, USDCxToken);
        uint256 extraDebt = getRemainingAmount(streams[msg.sender][receiver]);
        if (extraDebt > 0) {
            // overflow check
            if (debtAmounts[msg.sender] > 0) {
                debtAmounts[msg.sender] -= addFee(extraDebt);
            } else {
                depositAmounts[msg.sender] += addFee(extraDebt);
            }
        }
        distributeRewards((extraDebt * FEE) / 1000);
        emit StoppedStream(msg.sender, receiver, streams[msg.sender][receiver]);
        delete streams[msg.sender][receiver];
    }

    // deposit USDC
    function convertToUSDCx(uint256 amount) public {
        USDCToken.transferFrom(msg.sender, address(this), amount);
        USDCxToken.upgrade(amount);
        if (depositAmounts[msg.sender] == 0) {
            deposited.push(msg.sender);
        }
        depositAmounts[msg.sender] += amount;
        emit AddedUSDC(msg.sender, amount);
    }

    // withdraw USDC
    function convertToUSDC(uint256 amount) public {
        require(
            amount <= depositAmounts[msg.sender],
            "Cannot withdraw more than supplied."
        );
        depositAmounts[msg.sender] -= amount;
        USDCxToken.downgrade(amount);
        USDCToken.transfer(msg.sender, amount);
        emit RemovedUSDC(msg.sender, amount);
    }

    // gets the total collateral value of a user
    function getCollateralValue(address user) public view returns (uint256) {
        uint256 totalValue = 0;
        for (uint256 i = 0; i < allowedTokenList.length; i++) {
            uint256 currentTokenAmount = collateralAmounts[user][
                allowedTokenList[i]
            ];
            if (currentTokenAmount > 0) {
                totalValue +=
                    (currentTokenAmount *
                        getTokenPrice(allowedTokens[allowedTokenList[i]])) /
                    10**18;
            }
        }
        return totalValue;
    }

    // get the total borroable amount of a user
    function getBorrowableAmount(address user) public view returns (uint256) {
        uint256 totalValue = 0;
        for (uint256 i = 0; i < allowedTokenList.length; i++) {
            uint256 currentTokenAmount = collateralAmounts[user][
                allowedTokenList[i]
            ];
            if (currentTokenAmount > 0) {
                totalValue +=
                    (currentTokenAmount *
                        getTokenPrice(allowedTokens[allowedTokenList[i]]) *
                        allowedTokens[allowedTokenList[i]].borrowPercent) /
                    10**21;
            }
        }
        return totalValue - debtAmounts[user];
    }

    function getTotalUSDCx() public view returns (uint256) {
        return USDCxToken.balanceOf(address(this));
    }

    // allow token as collateral: admin function
    function allowToken(
        address tokenAddress,
        address priceFeedAddress,
        uint256 borrowPercent
    ) public onlyOwner {
        require(
            allowedTokens[tokenAddress].tokenAddress == address(0),
            "Token is already allowed."
        );
        allowedTokens[tokenAddress] = Token(
            tokenAddress,
            AggregatorV3Interface(priceFeedAddress),
            borrowPercent
        );
        allowedTokenList.push(tokenAddress);
    }

    // remove token from being a collateral: admin function
    // TODO: repay all deposited tokens
    function revokeToken(address tokenAddress) public onlyOwner {
        require(
            allowedTokens[tokenAddress].tokenAddress != address(0),
            "Token is not allowed."
        );
        delete allowedTokens[tokenAddress];

        // remove token from array
        for (uint256 i = 0; i < allowedTokenList.length; i++) {
            if (allowedTokenList[i] == tokenAddress) {
                allowedTokenList[i] = allowedTokenList[
                    allowedTokenList.length - 1
                ];
                allowedTokenList.pop();
                return;
            }
        }
    }

    // distributes amount of fee to lenders
    function distributeRewards(uint256 amount) private {
        for (uint256 i = 0; i < deposited.length; i++) {
            depositAmounts[deposited[i]] +=
                (amount * depositAmounts[deposited[i]]) /
                getTotalUSDCx();
        }
    }

    // returns the price in wei (10^18)
    function getTokenPrice(Token memory token) private view returns (uint256) {
        (, int256 price, , , ) = token.priceFeed.latestRoundData();
        return uint256(price) * 10**(18 - token.priceFeed.decimals());
    }

    // gets the remaining time for a stream in seconds
    function getRemainingAmount(Stream memory stream)
        private
        view
        returns (uint256)
    {
        if (stream.end < block.timestamp) {
            return 0;
        }
        return (stream.end - block.timestamp) * uint256(stream.flowRate);
    }

    // gets the total amount of stream in seconds
    function getTotalAmount(Stream memory stream)
        private
        pure
        returns (uint256)
    {
        return (stream.end - stream.start) * uint256(stream.flowRate);
    }

    // adds fee to an amount
    function addFee(uint256 amount) private pure returns (uint256) {
        return (amount * ((1000 + FEE) / 1000));
    }
}

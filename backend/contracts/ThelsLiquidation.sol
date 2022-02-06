// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

contract ThelsLiquidation is Ownable {
    using CFAv1Library for CFAv1Library.InitData;

    event SoldCollateral(
        address indexed borrower,
        address token,
        uint256 amount
    );
    // Liquidate borrower's token if the price of it drops below the borrowing amount
    function liquidate(address token, uint256 amount) public {
        // msg.sender supposed to be a borrower's address
        
        // Getting token price
        uint256 price = ((getTokenPrice(allowedTokens[token]) * amount) / (10**21)) * 
                    allowedTokens[token].borrowPercent +
                    debtAmounts[msg.sender];
        require(
            //check if collateral is worth of borrowed amount
            getBorrowableAmount(msg.sender) < price,
            "Token is worth of the debt"
        );
        require(
            amount > 0,
            "Amount of tokens to sell must be greater than 0"
        );

        IERC20 _token = IERC20(amount);
        depositAmounts[msg.sender][token] -= amount;

        _token.transfer(msg.sender, amount);
        USDCxToken.upgrade(amount);
        emit SoldCollateral(borrower, token, amount);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ThelsCollateral.sol";
import "./ThelsStreamer.sol";

contract ThelsCore is ThelsCollateral, ThelsStreamer {
    mapping(address => uint256) collateralAmounts;
    mapping(address => uint256) debtAmounts;

    function deposit(address token) public {}
}

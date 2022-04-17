// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenVesting {
    // amount of token to disperse to each benificiary
    uint256 private immutable _amount;
    // amount of token that will get released per minute
    uint256 private _releasePerMin;

    constructor(ERC20 token_, uint256 totalBenificiaries_) {
        _amount = token_.totalSupply() / totalBenificiaries_;
        _releasePerMin = (_amount * 60) / 365 days;
    }

    // returns the amount of token to disperse to a benificiary
    function amount() public view returns (uint256) {
        return _amount;
    }

    // returns the amount of token that will get released per minute
    function releasePerMin() public view returns (uint256) {
        return _releasePerMin;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenVesting {
    // amount of token to disperse to each benificiary
    uint256 private immutable _amount;
    // amount of token that will get released per minute
    uint256 private _releaseRate;
    // Map address to token released for that address
    mapping(address => uint256) addressToReleased;

    constructor(
        uint256 totalSupply_,
        uint256 totalBenificiaries_,
        uint256 vestingDuration_
    ) {
        _amount = (totalSupply_) / totalBenificiaries_;
        _releaseRate = (_amount * 60) / vestingDuration_;
    }

    // returns the amount of token to disperse to a benificiary
    function amount() public view returns (uint256) {
        return _amount;
    }

    // returns the amount of token that will get released per minute
    function releasePerMin() public view returns (uint256) {
        return _releaseRate;
    }

    // returns amount of token released for a beneficiary
    function tokenReleased(address beneficiary_)
        external
        view
        returns (uint256)
    {
        return addressToReleased[beneficiary_];
    }

    // returns total amount of token vested for a benificiary
    function tokenVested(uint256 startTime_, uint256 endTime_)
        external
        view
        returns (uint256)
    {
        uint256 minuteElasped = (block.timestamp - startTime_) / 60;
        uint256 duration = (endTime_ - startTime_) / 60;
        if (minuteElasped > duration) minuteElasped = duration;
        return minuteElasped * releasePerMin();
    }
}

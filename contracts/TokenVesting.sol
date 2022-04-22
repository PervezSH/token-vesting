// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenVesting {
    // amount of token to disperse to each benificiary
    uint256 private _amount;
    // amount of token that will get released per minute
    uint256 private _releaseRate;
    // Map address to token released for that address
    mapping(address => uint256) addressToReleased;

    // assign _amount, amount of token to disperse to each beneficiary
    function setAmount(uint256 totalSupply_, uint256 totalBenificiaries_)
        public
    {
        require(_amount == 0, "_amount: Already Initialized!");
        _amount = (totalSupply_) / totalBenificiaries_;
    }

    // assign _releaseRate, amount of to get released per minute
    function setReleaseRate(uint256 vestingDuration_) public {
        require(_amount != 0, "_amount Not Initialized!");
        require(_releaseRate == 0, "_releaseRate: Already Initialized!");
        _releaseRate = (_amount * 60) / vestingDuration_;
    }

    // returns the amount of token to disperse to a benificiary
    function amount() public view returns (uint256) {
        return _amount;
    }

    // returns the amount of token that will get released per minute
    function releaseRate() public view returns (uint256) {
        return _releaseRate;
    }

    // returns amount of token released for a beneficiary
    function tokenReleased(address beneficiary_) public view returns (uint256) {
        return addressToReleased[beneficiary_];
    }

    // returns total amount of token vested for a benificiary
    function tokenVested(uint256 startTime_, uint256 endTime_)
        public
        view
        returns (uint256)
    {
        uint256 minuteElasped = (block.timestamp - startTime_) / 60;
        uint256 duration = (endTime_ - startTime_) / 60;
        if (minuteElasped > duration) minuteElasped = duration;
        return minuteElasped * releaseRate();
    }

    // updates release amount for a beneficiary
    function updateReleasedAmount(uint256 releaseAmount_) internal {
        addressToReleased[msg.sender] += releaseAmount_;
    }
}

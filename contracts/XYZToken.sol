// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TokenVesting.sol";

contract XYZToken is ERC20, Ownable {
    // addresses where we will disperse token for 12 months, upto 10
    address[] private _beneficiaries = new address[](10);
    // timestamp when the token vesting is enabled
    uint256 private _vestingStartTime;
    // duration for which token will get dispersed(in seconds)
    uint256 private _vestingDuration;
    // token vesting smart contract
    TokenVesting tokenVesting;

    constructor(uint256 initialSupply) ERC20("XYZ Token", "XYZ") {
        _mint(msg.sender, initialSupply * (10**decimals()));
    }

    // returns benificiaries that will recieve tokens
    function beneficiaries() public view returns (address[] memory) {
        return _beneficiaries;
    }

    // add beneficiaries that will recieve tokens
    function addBenificiaries(address[] memory beneficiaries_)
        external
        onlyOwner
    {
        require(
            beneficiaries_.length <= 10,
            "You can add upto 10 benificiary!"
        );
        for (uint256 idx = 0; idx < beneficiaries_.length; idx++) {
            _beneficiaries[idx] = (beneficiaries_[idx]);
        }
    }

    // start vesting token for the added beneficiaries
    function enableTokenVesting(uint256 vestingDuration_) external onlyOwner {
        _vestingStartTime = block.timestamp;
        _vestingDuration = vestingDuration_;

        tokenVesting = new TokenVesting(
            totalSupply(),
            _beneficiaries.length,
            _vestingDuration
        );
    }

    // returns token vested for a benificiary
    function getVestedAmount() external view returns (uint256) {
        return
            tokenVesting.tokenVested(
                _vestingStartTime,
                _vestingStartTime + _vestingDuration
            );
    }

    // returns amount of token released for a beneficiary
    function getReleasedAmount(address beneficiary_)
        public
        view
        returns (uint256)
    {
        return tokenVesting.tokenReleased(beneficiary_);
    }
}

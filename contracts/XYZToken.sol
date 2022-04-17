// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XYZToken is ERC20, Ownable {
    // addresses where we will disperse token for 12 months, upto 10
    address[] private _beneficiaries = new address[](10);

    constructor(uint256 initialSupply) ERC20("XYZ Token", "XYZ") {
        _mint(msg.sender, initialSupply * (10**decimals()));
    }

    // returns benificiaries that will recieve tokens
    function beneficiaries() public view returns (address[] memory) {
        return _beneficiaries;
    }

    // add beneficiaries
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
}

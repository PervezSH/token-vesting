import { ethers } from "ethers";

// Args
const _totalSupply = 100000000;             // total token supply
const _decimals = 18;                       // token decimals
const _totalBeneficiaries = 10;             // number of addresses that will recieve token
const _vestingDuration = 31536000;          // duration for which token will get dispersed(in seconds)
const _releaseRate = 19.025875190258752;    // token to get released per minute for above token supply, beneficiary, and vesting duration

// async function addBeneficiaries() {
//     await xyzToken.addBenificiaries([
//         "0xbcd4042de499d14e55001ccbb24a551f3b954096",
//         "0x71be63f3384f5fb98995898a86b02fb2426c5788",
//         "0xfabb0ac9d68b0b445fb7357272ff202c5651694a",
//         "0x1cbd3b2770909d4e10f157cabc84c7264073c9ec",
//         "0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097",
//         "0xcd3b766ccdd6ae721141f452c550ca635964ce71",
//         "0x2546bcd3c84621e976d8185a91a922ae77ecec30",
//         "0xbda5747bfd65f08deb54cb465eb87d40e51b197e",
//         "0xdd2fd4581271e230360230f9337d5c0430bf44c0",
//         "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
//     ]);
//     const beneficiaries = await xyzToken.beneficiaries();
//     console.log("Beneficiaries : ");
//     console.log(beneficiaries);
// }

function getEth() {
    // @ts-ignore
    const eth = window.ethereum;
    if (!eth) throw new Error("Get MetaMask!!!");
    return eth;
}

async function hasAccunts() {
    const eth = getEth();
    const accounts = await eth.request({ methode: "eth_accounts" }) as string[];
    return accounts && accounts.length;
}

async function requestAccunts() {
    const eth = getEth();
    const accounts = await eth.request({ methode: "eth_requestAccounts" }) as string[];
    return accounts && accounts.length;
}

async function main() {
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    if (!await hasAccunts() && await requestAccunts()) {
        throw new Error("Can't Access MetaMask!!!");
    }
    // we should have access to your meta mask at this point
    // get provider, which is metamask
    const provider = new ethers.providers.Web3Provider(getEth());
    const contract = new ethers.Contract(
        contractAddress, // given the location of our contract, in this network
        [
            "function beneficiaries() public view returns (address[] memory)",
            "function addBenificiaries(address[] memory beneficiaries_) external onlyOwner",
            "function enableTokenVesting(uint256 vestingDuration_) external onlyOwner",
            "function getVestedAmount() public view returns (uint256)",
            "function getReleasedAmount(address beneficiary_) public view returns (uint256)",
            "function releaseToken() external onlyBeneficiaries",
        ], // give interface, abi
        provider, // tells where the networks at
    );
    // add beneficiaries
    await contract.addBenificiaries([
        "0xbcd4042de499d14e55001ccbb24a551f3b954096",
        "0x71be63f3384f5fb98995898a86b02fb2426c5788",
        "0xfabb0ac9d68b0b445fb7357272ff202c5651694a",
        "0x1cbd3b2770909d4e10f157cabc84c7264073c9ec",
        "0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097",
        "0xcd3b766ccdd6ae721141f452c550ca635964ce71",
        "0x2546bcd3c84621e976d8185a91a922ae77ecec30",
        "0xbda5747bfd65f08deb54cb465eb87d40e51b197e",
        "0xdd2fd4581271e230360230f9337d5c0430bf44c0",
        "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
    ]);
    const beneficiaries = await contract.beneficiaries();
    console.log("Beneficiaries: ")
    console.log(beneficiaries);
}

main();
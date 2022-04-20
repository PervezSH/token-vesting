import "@nomiclabs/hardhat-ethers";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const _totalSupply = 100000000;             // total token supply
const _decimals = 18;                       // token decimals

async function deployContract() {
    const XYZToken = await ethers.getContractFactory("XYZToken");
    const xyzToken = await XYZToken.deploy(_totalSupply);
    await xyzToken.deployed();
    return xyzToken;
}

async function printContractInfo(xyzToken: Contract) {
    console.log("Token deployed to: ", xyzToken.address);
    console.log("Token deployed by: ", await xyzToken.owner());
    console.log("Total supply: ", (await xyzToken.totalSupply()) / 10 ** _decimals);
    console.log("Decimals: ", await xyzToken.decimals())
}

deployContract().then(printContractInfo);
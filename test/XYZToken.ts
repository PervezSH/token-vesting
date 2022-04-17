import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("XYZ Token", () => {
    async function deployToken(initialSupply: any) {
        const XYZToken = await ethers.getContractFactory("XYZToken");
        const xyzToken = await XYZToken.deploy(initialSupply);
        await xyzToken.deployed();

        return xyzToken;
    }

    let xyzToken: Contract;
    before(async function () {
        xyzToken = await deployToken(100000000);
    })

    // check if total supply is 1 million
    it("should print the initial token supply", async function () {
        expect(await xyzToken.totalSupply()).to.equal(100000000);
    })

    // check the balnce of owner
    it("should print the balance of ownwer", async function () {
        expect(await xyzToken.balanceOf("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")).to.equal(100000000);
    })
});
import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let xyzToken: Contract;

async function deployContract(name: string, ...args: any) {
    const Contract = await ethers.getContractFactory(name);
    const contract = await Contract.deploy(...args);
    await contract.deployed();

    return contract;
}

describe("XYZ Token", () => {
    before(async function () {
        xyzToken = await deployContract("XYZToken", 100000000);
    })

    it("should check whether the decimals value is 18", async function () {
        expect(await xyzToken.decimals()).to.equal(18);
    })

    it("should check the initial token supply is 100000000", async function () {
        expect(await xyzToken.totalSupply()).to.equal(100000000 * (10 ^ 18));
    })

    it("should check beneficiaries added succesfully", async function () {
        await xyzToken.addBenificiaries(["0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"]);
        const b = (await xyzToken.beneficiaries())[0];
        expect(b.toLowerCase()).to.equal("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");
    })

    it("should fail at adding beneficiaries", async function () {
        let e: any;
        try {
            await xyzToken.addBenificiaries([
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
            ])
        } catch (err) {
            e = err;
        }
        expect(e.message.includes("You can add upto 10 benificiary!")).to.equal(true);
    })
});
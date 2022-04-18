import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

let xyzToken: Contract;
let tokenVesting: Contract;
// Args
const _totalSupply = 100000000;             // total token supply
const _decimals = 18;                       // token decimals
const _totalBeneficiaries = 10;             // number of addresses that will recieve token
const _vestingDuration = 31536000;          // duration for which token will get dispersed(in seconds)
const _releaseRate = 19.025875190258752;    // token to get released per minute for above token supply, beneficiary, and vesting duration

async function deployContract(name: string, ...args: any) {
    const Contract = await ethers.getContractFactory(name);
    const contract = await Contract.deploy(...args);
    await contract.deployed();

    return contract;
}

describe("XYZ Token", () => {
    before(async function () {
        xyzToken = await deployContract("XYZToken", _totalSupply);
    })

    it("should check whether the decimals value is 18", async function () {
        expect(await xyzToken.decimals()).to.equal(_decimals);
    })

    it("should check the initial token supply", async function () {
        expect((await xyzToken.totalSupply()) / 10 ** _decimals).to.equal(_totalSupply);
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

    it("should return token vested equal to 0 for time elapsed equal to 0 minute", async function () {
        await xyzToken.enableTokenVesting(_vestingDuration);
        expect((await xyzToken.getVestedAmount()) / 10 ** 18).to.equal(0);
    })

    it("should return the amount of token released for a benificiary", async function () {
        expect(await xyzToken.getReleasedAmount("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199")).to.equal(0);
    })
});

describe("Token Vesting", () => {
    before(async function () {
        tokenVesting = await deployContract("TokenVesting", _totalSupply, _totalBeneficiaries, _vestingDuration);
    })

    it("should check amount to disperse to a benificiary", async function () {
        expect((await tokenVesting.amount()) / 10 ** _decimals).to.equal(_totalSupply / _totalBeneficiaries);
    })

    it("should check release rate", async function () {
        expect((await tokenVesting.releasePerMin()) / 10 ** _decimals).to.equal(_releaseRate);
    })

    it("should return token vested equal to the maximum amount of token a benificiary can recieve", async function () {
        expect((await tokenVesting.tokenVested(0, _vestingDuration)) / 10 ** _decimals).to.equal(_totalSupply / _totalBeneficiaries);
    })

    it("should return the amount of token released for a beneficiary", async function () {
        expect((await tokenVesting.tokenReleased("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"))).to.equal(0);
    })
});
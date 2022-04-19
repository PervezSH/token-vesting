import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { describe } from "mocha";

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

    describe("#constructor()", () => {
        it("should check whether the decimals value is 18", async function () {
            expect(await xyzToken.decimals()).to.equal(_decimals);
        })

        it("should check the initial token supply", async function () {
            expect((await xyzToken.totalSupply()) / 10 ** _decimals).to.equal(_totalSupply);
        })
    })

    describe("#addBeneficiaries()", () => {
        it("should check beneficiaries added succesfully", async function () {
            await xyzToken.addBenificiaries([
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
            ]);
            const b = (await xyzToken.beneficiaries())[0];
            expect(b.toLowerCase()).to.equal("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");
        })

        it("should fail at adding beneficiaries as you can add more than 10 beneficiary", async function () {
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
    })

    describe("#getVestedAmount()", function () {
        it("should return token vested equal to 0 for time elapsed equal to 0 minute", async function () {
            await xyzToken.enableTokenVesting(_vestingDuration);
            expect((await xyzToken.getVestedAmount()) / 10 ** 18).to.equal(0);
        })
    })

    describe("#getReleasedAmount()", function () {
        it("should return the amount of token released for a benificiary", async function () {
            expect(await xyzToken.getReleasedAmount("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199")).to.equal(0);
        })
    })

    describe("#releaseToken()", function () {
        it("should fail to release token as called by account not a beneficiary", async function () {
            let e: any;
            try {
                await xyzToken.releaseToken();
            } catch (err) {
                e = err
            }
            expect(e.message.includes("You are not a benificiary!")).to.equal(true);
        })

        it("should fail to release token saying NO TOKEN TO RELEASE", async function () {
            let e: any;
            try {
                await xyzToken.addBenificiaries([
                    "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
                ]);
                await xyzToken.enableTokenVesting(_vestingDuration);
                await xyzToken.releaseToken();
            } catch (err) {
                e = err;
            }
            expect(e.message.includes("No tokens to release")).to.equal(true);
        })
    })
});

describe("Token Vesting", () => {
    before(async function () {
        tokenVesting = await deployContract("TokenVesting", _totalSupply, _totalBeneficiaries, _vestingDuration);
    })

    describe("#constructor()", function () {
        it("should check amount to disperse to a benificiary", async function () {
            expect((await tokenVesting.amount()) / 10 ** _decimals).to.equal(_totalSupply / _totalBeneficiaries);
        })

        it("should check release rate", async function () {
            expect((await tokenVesting.releasePerMin()) / 10 ** _decimals).to.equal(_releaseRate);
        })
    })

    describe("#tokenVested()", function () {
        it("should return token vested equal to the maximum amount of token a benificiary can recieve", async function () {
            expect((await tokenVesting.tokenVested(0, _vestingDuration)) / 10 ** _decimals).to.equal(_totalSupply / _totalBeneficiaries);
        })
    })

    describe("#tokenReleased()", function () {
        it("should return the amount of token released for a beneficiary", async function () {
            expect((await tokenVesting.tokenReleased("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"))).to.equal(0);
        })
    })
});
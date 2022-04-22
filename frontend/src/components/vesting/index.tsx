import React, { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";

type Props = {
    contract: Contract | undefined;
    beneficiaries: string[];
}

const Vesting: React.FC<Props> = ({ contract, beneficiaries }) => {
    const [startDate, setStartDate] = useState<Date>(new Date(0));
    const [endDate, setEndDate] = useState<Date>(new Date(0));
    const [totalVesting, setTotalVesting] = useState<number>(0);
    const [alreadyVested, setAlreadyVested] = useState<number>(0);
    const [alreadyReleased, setAlreadyReleased] = useState<number>(0);

    // transfers amount of releaseable 
    const releaseToken = async () => {
        try {
            //@ts-ignore
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            console.log(address);
            await contract?.releaseToken();
        } catch (error) {
            const stringifiedError = JSON.stringify(error);
            if (stringifiedError.includes("You are not a benificiary!")) {
                alert("You are not a benificiary!");
            }
            else if (stringifiedError.includes("No tokens to release")) {
                alert("No tokens to release");
            }
            else {
                console.log("Something went wrong while releasing token: ", error);
            }
        }
    }

    useEffect(() => {
        // fetch the timestamp when token vesting is enabled
        const fetchVestingStartDate = async () => {
            try {
                if (contract) {
                    const txn = await contract.vestingStartTime();
                    setStartDate(new Date(txn * 1000));
                }
            } catch (error) {
                console.log("Something went wrong while fetching vesting start time: ", error);
            }
        }
        fetchVestingStartDate();
        // fetch duration for which token will get dispersed
        const fetchVestingDuration = async () => {
            try {
                if (contract) {
                    const txn = await contract.vestingDuration();
                    setEndDate(new Date(startDate.valueOf() + (txn * 1000)));
                }
            } catch (error) {
                console.log("Something went wrong while fetching vesting duration: ", error);
            }
        }
        fetchVestingDuration();
    }, [contract, startDate]);

    useEffect(() => {
        // fetch the amount of token that will get vested
        const fetchTotalVesting = async () => {
            try {
                if (contract) {
                    const vestingAmount = await contract.amount() / 10 ** (await contract.decimals());
                    setTotalVesting(vestingAmount * beneficiaries.length);
                }
            } catch (error) {
                console.log("Something went wrong while fetching total vesting: ", error);
            }
        }
        fetchTotalVesting();
        // fetch the amount of token that will get vested
        const fetchAlreadyVested = async () => {
            try {
                if (contract) {
                    const vestingAmount = await contract.getVestedAmount() / 10 ** (await contract.decimals());
                    setAlreadyVested(vestingAmount * beneficiaries.length);
                }
            } catch (error) {
                console.log("Something went wrong while fetching total vesting: ", error);
            }
        }
        fetchAlreadyVested();
        setInterval(fetchAlreadyVested, 60000);
    }, [contract, beneficiaries]);

    useEffect(() => {
        // fetch the amount of token that is already released
        const fetchAlreadyReleased = async () => {
            try {
                let releasedAmount = 0;
                for (let beneficiary of beneficiaries) {
                    releasedAmount += ((await contract?.tokenReleased(beneficiary)) / 10 ** await contract?.decimals());
                }
                setAlreadyReleased(releasedAmount);
            } catch (error) {
                console.log("Something went wrong while fetching already released token: ", error);
            }
        }
        fetchAlreadyReleased();
    }, [contract, beneficiaries]);

    return (
        <div>
            <h2>
                Vesting Details
            </h2>
            <div className="details-item">
                <p>Start Date</p>
                <div>
                    {startDate.getHours()}:{startDate.getMinutes()} {startDate.getDate()}/{startDate.getMonth()}/{startDate.getFullYear()}
                </div>
            </div>
            <div className="details-item">
                <p>End Date</p>
                <div>
                    {endDate.getHours()}:{endDate.getMinutes()} {endDate.getDate()}/{endDate.getMonth()}/{endDate.getFullYear()}
                </div>
            </div>
            <div className="details-item">
                <p>Total Vesting</p>
                <div>
                    {totalVesting}
                </div>
            </div>
            <div className="details-item">
                <p>Already Vested</p>
                <div>
                    {alreadyVested}
                </div>
            </div>
            <div className="details-item">
                <p>Already Released</p>
                <div>
                    {alreadyReleased}
                </div>
            </div>
            <button className="release-button" onClick={releaseToken}>
                Release
            </button>
        </div>
    )
}

export default Vesting;
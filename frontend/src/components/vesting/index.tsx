import React, { useCallback, useEffect, useState } from "react";
import { Contract } from "ethers";
import "./css/vesting.css"

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
            const txn = await contract?.releaseToken();
            await txn.wait();
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
        alert("XYZ token got released successfully!");
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


    // fetch the amount of token that is already released
    const fetchAlreadyReleased = useCallback(async () => {
        try {
            let releasedAmount = 0;
            for (let beneficiary of beneficiaries) {
                releasedAmount += ((await contract?.tokenReleased(beneficiary)) / 10 ** await contract?.decimals());
            }
            setAlreadyReleased(releasedAmount);
        } catch (error) {
            console.log("Something went wrong while fetching already released token: ", error);
        }
    }, [contract, beneficiaries])

    useEffect(() => {
        fetchAlreadyReleased();
    }, [fetchAlreadyReleased]);

    // listen to token release event
    useEffect(() => {
        contract?.on("TokenRelease", (releasedAmount) => {
            console.log(releasedAmount);
            fetchAlreadyReleased();
        })
    }, [contract, fetchAlreadyReleased]);

    return (
        <div className='vesting-section'>
            <h2>
                Vesting Details
            </h2>
            <div className="vesting-box">
                <div className="details-item">
                    <div className="details-text">Start Date</div>
                    <div>
                        {startDate.getHours()}:{startDate.getMinutes()} {startDate.getDate()}/{startDate.getMonth()}/{startDate.getFullYear()}
                    </div>
                </div>
                <div className="details-item">
                    <div className="details-text">End Date</div>
                    <div>
                        {endDate.getHours()}:{endDate.getMinutes()} {endDate.getDate()}/{endDate.getMonth()}/{endDate.getFullYear()}
                    </div>
                </div>
                <div className="details-item">
                    <div className="details-text">Total Vesting</div>
                    <div>
                        {totalVesting}
                    </div>
                </div>
                <div className="details-item">
                    <div className="details-text">Already Vested</div>
                    <div>
                        {alreadyVested}
                    </div>
                </div>
                <div className="details-item">
                    <div className="details-text">Already Released</div>
                    <div>
                        {alreadyReleased}
                    </div>
                </div>
            </div>
            <button onClick={releaseToken}>
                Release
            </button>
            <div>
                This will trigger transactions that you will need to sign.
            </div>
        </div>
    )
}

export default Vesting;
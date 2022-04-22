import React, { useEffect, useState } from "react";
import { Contract } from "ethers";

type Props = {
    contract: Contract | undefined;
    beneficiaries: string[];
}

const Beneficiary: React.FC<Props> = ({ contract, beneficiaries }) => {
    const [released, setReleased] = useState<number[]>([]);
    const [releasable, setReleasable] = useState<number[]>([]);

    useEffect(() => {
        // fetch amount of token released for each of the beneficiary
        const fetchReleasedToken = async () => {
            try {
                let array: Array<number> = [];
                for (let beneficiary of beneficiaries) {
                    array.push((await contract?.tokenReleased(beneficiary)) / 10 ** await contract?.decimals());
                }
                setReleased(array);
            } catch (error) {
                console.log("Something went wrong while fetching released token: ", error);
            }
        }
        fetchReleasedToken()
        // fetch amount of token releasable for a beneficiary
        const fetchReleasableToken = async () => {
            try {
                let array: Array<number> = [];
                const vestingAmount = (await contract?.getVestedAmount()) / 10 ** await contract?.decimals();
                for (let amount of released) {
                    array.push(vestingAmount - amount)
                }
                setReleasable(array);
            } catch (error) {
                console.log("Something went wrong while fetching releasable token: ", error);
            }
        }
        setInterval(fetchReleasableToken, 60000);
    }, [contract, beneficiaries, released]);

    return (
        <div>
            <h2>
                Beneficiary Details
            </h2>
            <div className="detail-header">
                <p className="header-text">
                    Address
                </p>
                <p className="header-text">
                    Token Releasable
                </p>
                <p className="header-text">
                    Token Released
                </p>
            </div>
            <div className="beneficiary-box">
                <div className="beneficiary-address">
                    {beneficiaries.map((address) => (
                        <p key={address}>
                            {address}
                        </p>
                    ))}
                </div>
                <div className="token-releasable">
                    {releasable.map((releasablAmount, index) => (
                        <p key={index}>
                            {releasablAmount}
                        </p>
                    ))}
                </div>
                <div className="token-released">
                    {released.map((releaseAmount, index) => (
                        <p key={index}>
                            {releaseAmount}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Beneficiary; 
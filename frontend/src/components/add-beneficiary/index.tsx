import React, { useState } from "react";
import { Contract } from "ethers";

type Props = {
    contract: Contract | undefined;
}

const AddBeneficiary: React.FC<Props> = ({ contract }) => {
    const [beneficiaryInput, setBeneficiaryInput] = useState<string>("");
    const [durationInput, setDurationInput] = useState<number>();
    const [beneficiaries] = useState<string[]>([]);

    const addBeneficiaryToList = () => {
        if (beneficiaryInput !== "") {
            if (beneficiaries.length < 10) beneficiaries.push(beneficiaryInput)
            else alert("Maximum of 10 address can be added 🤕")
            setBeneficiaryInput("");
        }
    }

    const startVesting = async () => {
        try {
            if (contract && beneficiaries.length !== 0 && durationInput) {
                // add beneficiary
                console.log("Enabling vesting...🚀");
                await contract.addBenificiaries(beneficiaries);
                console.log("Beneficiary added succesfully ✅");
                await contract.enableTokenVesting(durationInput * 86400);
                console.log("Token vesting enabled ✅");
                window.location.reload()
            }
        } catch (error) {
            console.log("Something went wrong while enabling token vesting: ", error);
        }
        setDurationInput(0);
    }

    return (
        <div>
            <h2>
                Beneficiary
            </h2>
            <p>
                Addresses where the token will get dispersed evenly, max of 10 addresses only!
            </p>
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    addBeneficiaryToList();
                }}>
                    <input type="text" placeholder="Enter beneficiary address"
                        value={beneficiaryInput}
                        onChange={(e) => setBeneficiaryInput(e.target.value)}
                    />
                </form>
                <button className="button add-beneficiary" onClick={addBeneficiaryToList}>
                    Add
                </button>
            </div>
            <div className="beneficiary-list">
                {beneficiaries.map((item) => (
                    <div className="beneficiary-list-item" key={item}>
                        {item}
                    </div>
                ))}
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                startVesting();
            }}>
                <input type="number" placeholder="Enter vesting duration (in days)"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.valueAsNumber)}
                />
            </form>
            <button className="button start-vesting" onClick={startVesting}>
                Start Vesting
            </button>
        </div>
    )
}

export default AddBeneficiary;
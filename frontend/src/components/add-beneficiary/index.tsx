import React, { useState } from "react";
import { Contract } from "ethers";
import "./css/add-beneficiary.css";

type Props = {
    contract: Contract | undefined;
}

const AddBeneficiary: React.FC<Props> = ({ contract }) => {
    const [beneficiaryInput, setBeneficiaryInput] = useState<string>("");
    const [durationInput, setDurationInput] = useState<number>();
    const [beneficiaries] = useState<string[]>([]);
    const [isVesting, setIsVesting] = useState<boolean>(false);

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
                setIsVesting(true);
                const txn1 = await contract.addBenificiaries(beneficiaries);
                await txn1.wait();
                console.log("Beneficiary added succesfully ✅");
                const txn2 = await contract.enableTokenVesting(durationInput * 86400);
                await txn2.wait();
                console.log("Token vesting enabled ✅");
                setIsVesting(false)
                window.location.reload()
            }
        } catch (error) {
            const strigifiedError = JSON.stringify(error);
            if (strigifiedError.includes("resolver or addr is not configured for ENS name")) {
                alert("Please enter valid addresses!");
            } else {
                console.log("Something went wrong while enabling token vesting: ", error);
            }
        }
        setIsVesting(false)
        setDurationInput(0);
    }

    return (
        <div className="add-beneficiary-section">
            <h2>
                Beneficiary
            </h2>
            <p>
                Addresses where the token will get dispersed evenly, max of 10 addresses only!
            </p>
            <form onSubmit={(e) => {
                e.preventDefault();
                addBeneficiaryToList();
            }}>
                <input type="text" placeholder="Enter beneficiary address"
                    value={beneficiaryInput}
                    onChange={(e) => setBeneficiaryInput(e.target.value)}
                />
                <button className="button add-beneficiary" onClick={addBeneficiaryToList}>
                    Add
                </button>
            </form>
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
            <button className="start-vesting" onClick={startVesting}>
                {isVesting ? 'Starting...' : 'Start Vesting'}
            </button>
        </div>
    )
}

export default AddBeneficiary;
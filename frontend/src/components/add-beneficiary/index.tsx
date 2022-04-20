import React, { useState } from "react";

const AddBeneficiary = () => {
    const [beneficiaryInput, setBeneficiaryInput] = useState<string>("");
    const [beneficiaries] = useState<string[]>([]);

    const addBeneficiaryToList = () => {
        if (beneficiaryInput !== "") {
            if (beneficiaries.length < 10) beneficiaries.push(beneficiaryInput)
            else alert("Maximum of 10 address can be added 🤕")
            setBeneficiaryInput("");
        }
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
            <button className="button start-vesting" >
                Start Vesting
            </button>
        </div>
    )
}

export default AddBeneficiary;
import React, { useState, useEffect } from 'react';
import { Contract, ethers } from "ethers";
import abi from "./utils/XYZToken.json";
import './App.css';
import AddBeneficiary from './components/add-beneficiary';
import Beneficiary from './components/beneficiary';
import Vesting from './components/vesting';

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [tokenContract, setTokenContract] = useState<Contract>();
  const [beneficiaries, setBeneficiaries] = useState<string[]>([]);
  const [chainID, setChainID] = useState<string>("");

  // check for wallet, and connects it if we're authorized to
  const checkIfWalletIsConnected = async () => {
    try {
      // @ts-ignore
      // check if user have metamask or not
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if user is connected to rinkeby test network
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      setChainID(chainId);

      // if we're authorized to acess the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No authorized account found!");
      }

    } catch (err) {
      console.log(err)
    }
  }

  // connects wallet to this site
  const connectWallet = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask");
        return;
      }
      // If we find MetaMask, ask MetaMask to give access to user's wallet
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected : ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // set a reusable contract object
  useEffect(() => {
    //@ts-ignore
    const { ethereum } = window;

    if (ethereum) {
      //@ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x9f56255C8b303131C18cb9b5D98e66dE7bcb1738",
        abi.abi,
        signer
      );
      setTokenContract(contract);
      console.log("Token Contract: ", contract)
    }
  }, []);

  // fetchs beneficiaries from the contract
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        if (tokenContract) {
          const txn = await tokenContract.beneficiaries();
          setBeneficiaries(txn);
          console.log(txn);
        }
      } catch (error) {
        console.log("Something went wrong while fetching beneficiaries :", error)
      }
    }

    if (currentAccount) {
      console.log("Fetching beneficiaries...");
      fetchBeneficiaries();
    }
  }, [tokenContract, currentAccount]);

  const renderContent = () => {
    if (chainID === "0x4") {
      if (!currentAccount) {
        return (
          <div>
            <div className='subheader-text'>
              Interact with the XYZ token 🪙
            </div>
            <button className='connect-wallet' onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        );
      } else {
        if (beneficiaries.length === 0) {
          return (
            <div>
              <AddBeneficiary contract={tokenContract} />
            </div>
          )
        } else {
          return (
            <div className='App-body'>
              <div>
                <Beneficiary contract={tokenContract} beneficiaries={beneficiaries} />
              </div>
              <div >
                <Vesting contract={tokenContract} beneficiaries={beneficiaries} />
              </div>
            </div>
          )
        }
      }
    } else {
      return (
        <div style={{ color: "white" }}>
          <h2>Please connect to Rinkeby</h2>
          <p>
            This dapp only works on the Rinkeby network, please switch networks
            in your connected wallet and refresh page.
          </p>
        </div >
      );
    }
  }

  return (
    <div className="App">
      <div className='container'>
        <header className="App-header">
          XYZ Token DApp 🚀
        </header>
        {beneficiaries.length > 0 &&
          <div className='subheader-text'>
            Congratulations on being a beneficiary 🥳
          </div>
        }
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;

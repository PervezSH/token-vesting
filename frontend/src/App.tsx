import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import abi from "./utils/XYZToken.json";
import './App.css';
import Beneficiary from './components/beneficiary';
import Vesting from './components/vesting';

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);

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

  //Connects my wallet to this site
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
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        abi.abi,
        signer
      );
      //@ts-ignore
      setTokenContract(contract);
      console.log("Token Contract: ", contract)
    }
  }, []);


  const renderContent = () => {
    if (!currentAccount) {
      return (
        <div>
          <div className='subheader-text'>
            Interact with the XYZ token
          </div>
          <button className='button connect-wallet' onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <div className='beneficiary-section'>
            <Beneficiary />
          </div>
          <div className='vesting-section'>
            <Vesting />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="App">
      <div className='container'>
        <header className="App-header">
          <div className='header-text'>
            XYZ Token DApp
          </div>
        </header>
        <div className='App-body'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MyNFT from "./NFTMarketplace.json";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [balanceAddress, setBalanceAddress] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [nftBalance, setNftBalance] = useState("");
  const creatorAddress = process.env.REACT_APP_CREATOR_ADDRESS;
  const recipientAddress = process.env.REACT_APP_RECIPIENT_ADDRESS;

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
        setAccount(address);

        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        const nftContract = new ethers.Contract(
          contractAddress,
          MyNFT.abi,
          signer
        );
        setContract(nftContract);
      }
    };
    init();
  }, []);

  const mintNFT = async () => {
    if (contract && account === creatorAddress) {
      try {
        const tx = await contract.mint(recipientAddress, tokenURI);
        await tx.wait();
        console.log("NFT minted successfully!");
      } catch (error) {
        console.error("Error minting NFT:", error);
      }
    } else {
      console.error("Only the creator can mint NFTs");
    }
  };

  const getTokenURI = async () => {
    if (contract && tokenId) {
      try {
        const uri = await contract.tokenURI(tokenId);
        console.log("Token URI:", uri);
      } catch (error) {
        console.error("Error getting token URI:", error);
      }
    }
  };

  // Add these new functions:
  const checkOwnership = async () => {
    if (contract && tokenId) {
      try {
        const owner = await contract.ownerOf(tokenId);
        setOwnerAddress(owner);
      } catch (error) {
        console.error("Error checking ownership:", error);
      }
    }
  };

  const getBalance = async (address) => {
    if (contract) {
      try {
        const balance = await contract.balanceOf(address);
        setNftBalance(balance.toString());
      } catch (error) {
        console.error("Error getting balance:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>MyNFT Interaction</h1>
      <p>Connected Account: {account}</p>
      <p>Creator Address: {creatorAddress}</p>
      <p>Recipient Address: {recipientAddress}</p>
      <div>
        <input
          type="text"
          placeholder="Token URI"
          value={tokenURI}
          onChange={(e) => setTokenURI(e.target.value)}
        />
        <button onClick={mintNFT} disabled={account !== creatorAddress}>
          Mint NFT
        </button>
      </div>
      <div>
        <input
          type="number"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <button onClick={getTokenURI}>Get Token URI</button>
      </div>
      <div>
        <button onClick={() => checkOwnership()}>Check Ownership</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Address to check balance"
          onChange={(e) => setBalanceAddress(e.target.value)}
        />
        <button onClick={() => getBalance(balanceAddress)}>Get Balance</button>
      </div>
      <p>
        Owner of token {tokenId}: {ownerAddress}
      </p>
      <p>NFT balance: {nftBalance}</p>
    </div>
  );
}

export default App;

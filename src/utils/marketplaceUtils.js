// src/utils/marketplaceUtils.js

import { ethers } from "ethers";
import { MARKETPLACE_CONTRACT_ADDRESS } from "../config/config";
import NFTMarketplaceJSON from "../contracts/NFTMarketplace.json";
import {
  uploadFileToIPFS,
  uploadMetadataToIPFS,
  getMetadataFromIPFS,
} from "./ipfsUtils";

const MARKETPLACE_ABI = NFTMarketplaceJSON.abi;

async function getContract() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        MARKETPLACE_ABI,
        signer
      );

      return contract;
    } catch (error) {
      console.error("Failed to connect to the Ethereum network:", error);
      throw new Error("Please connect to MetaMask or another Ethereum wallet");
    }
  } else {
    throw new Error(
      "Ethereum provider not found. Please install MetaMask or use an Ethereum-enabled browser."
    );
  }
}

export async function createNFT(name, description, imageFile) {
  try {
    const imageUrl = await uploadFileToIPFS(imageFile);
    const metadata = { name, description, image: imageUrl };
    const metadataUrl = await uploadMetadataToIPFS(metadata);

    const contract = await getContract();
    console.log("Contract instance:", contract);

    const tx = await contract.mint(metadataUrl);
    console.log("Transaction:", tx);

    const receipt = await tx.wait();
    console.log("Transaction receipt:", receipt);

    // In ethers v6, we need to use the logs directly
    const transferLog = receipt.logs.find(
      (log) =>
        log.topics[0] === contract.interface.getEvent("Transfer").topicHash
    );

    if (transferLog) {
      const tokenId = contract.interface
        .parseLog(transferLog)
        .args.tokenId.toString();
      console.log("Minted NFT with token ID:", tokenId);
      return tokenId;
    }

    throw new Error("Failed to retrieve tokenId from transaction logs");
  } catch (error) {
    console.error("Error creating NFT:", error);
    throw error;
  }
}

export async function listNFTOnMarketplace(tokenId, price) {
  const contract = await getContract();
  const listingPrice = ethers.parseEther(price.toString());
  const tx = await contract.listNFT(tokenId, listingPrice);
  await tx.wait();
}

export async function getListedNFTs() {
  const contract = await getContract();
  const listedNFTIds = await contract.getListedNFTs();
  const nfts = await Promise.all(
    listedNFTIds.map(async (id) => {
      const tokenURI = await contract.tokenURI(id);
      const metadata = await getMetadataFromIPFS(tokenURI);
      const listing = await contract._listings(id);
      return {
        tokenId: id.toString(),
        name: metadata.name,
        description: metadata.description,
        image: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
        price: ethers.formatEther(listing.price),
        seller: listing.seller,
      };
    })
  );
  return nfts;
}

export async function buyNFT(tokenId) {
  const contract = await getContract();
  const listing = await contract._listings(tokenId);
  const tx = await contract.buyNFT(tokenId, {
    value: listing.price,
  });
  await tx.wait();
}

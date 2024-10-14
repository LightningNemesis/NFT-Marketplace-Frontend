// Component for creating NFTs

// src/components/NFTCreator.js
import React, { useState } from "react";
import { createNFT, listNFTOnMarketplace } from "../utils/marketplaceUtils";

function NFTCreator() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");

  async function handleCreate() {
    try {
      const tokenId = await createNFT(name, description, image);
      alert(`NFT created successfully! Token ID: ${tokenId}`);
      // Clear form fields after successful creation
      setName("");
      setDescription("");
      setImage(null);
      setPrice("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating NFT. See console for details.");
    }
  }

  async function handleList() {
    try {
      const tokenId = prompt("Enter the Token ID of the NFT you want to list:");
      if (tokenId) {
        await listNFTOnMarketplace(tokenId, price);
        alert("NFT listed successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error listing NFT. See console for details.");
    }
  }

  return (
    <div>
      <h2>Create NFT</h2>
      <input
        type="text"
        placeholder="NFT Name"
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <input
        type="number"
        placeholder="Price in ETH"
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleCreate}>Create NFT</button>

      <h2>List NFT</h2>
      <input
        type="number"
        placeholder="Price in ETH"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleList}>List NFT</button>
    </div>
  );
}

export default NFTCreator;

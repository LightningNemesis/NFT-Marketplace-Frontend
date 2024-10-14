// Component for listing NFTs.

// src/components/MarketplaceListing.js
import React, { useState, useEffect } from "react";
import { getListedNFTs, buyNFT } from "../utils/marketplaceUtils";

function MarketplaceListing() {
  const [listedNFTs, setListedNFTs] = useState([]);

  useEffect(() => {
    fetchListedNFTs();
  }, []);

  async function fetchListedNFTs() {
    const nfts = await getListedNFTs();
    setListedNFTs(nfts);
  }

  async function handleBuy(tokenId, price) {
    try {
      await buyNFT(tokenId, price);
      alert("NFT purchased successfully!");
      fetchListedNFTs(); // Refresh the list
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert("Error buying NFT. See console for details.");
    }
  }

  return (
    <div>
      <h2>Marketplace Listings</h2>
      {listedNFTs.map((nft) => (
        <div key={nft.tokenId}>
          <h3>{nft.name}</h3>
          <p>{nft.description}</p>
          <img src={nft.image} alt={nft.name} style={{ width: "200px" }} />
          <p>Price: {nft.price} ETH</p>
          <button onClick={() => handleBuy(nft.tokenId, nft.price)}>Buy</button>
        </div>
      ))}
    </div>
  );
}

export default MarketplaceListing;

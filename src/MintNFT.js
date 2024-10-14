// MintNFT.js
import React, { useState } from "react";
import { mintNFT } from "./BlockchainService";

export default function MintNFT() {
  const [royalty, setRoyalty] = useState("");

  const handleMint = () => {
    mintNFT(royalty);
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Royalty (in basis points)"
        value={royalty}
        onChange={(e) => setRoyalty(e.target.value)}
      />
      <button onClick={handleMint}>Mint NFT</button>
    </div>
  );
}

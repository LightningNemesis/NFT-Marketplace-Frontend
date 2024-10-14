import React from "react";
import WalletConnection from "./components/WalletConnection";
import NFTCreator from "./components/NFTCreator";
import MarketplaceListing from "./components/NFTListing";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>NFT Marketplace</h1>
      <WalletConnection />
      <NFTCreator />
      {/* <MarketplaceListing /> */}
    </div>
  );
}

export default App;

// src/config/config.js
export const MARKETPLACE_CONTRACT_ADDRESS =
  process.env.REACT_APP_CONTRACT_ADDRESS;

if (!MARKETPLACE_CONTRACT_ADDRESS) {
  console.error(
    "Marketplace contract address not set in environment variables"
  );
}

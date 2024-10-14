import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet, Contract, parseUnits } from "ethers";
import contractABI from "./NFTMarketplace.json"; // Load your contract ABI

const provider = new JsonRpcProvider(process.env.REACT_APP_RPC_URL);
const wallet = new Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
const contract = new Contract(
  process.env.REACT_APP_CONTRACT_ADDRESS,
  contractABI.abi,
  wallet
);

export async function mintNFT(royalty) {
  try {
    // Ensure royalty is passed as a string to prevent precision issues
    const tx = await contract.mintNFT(parseUnits(royalty.toString(), "wei"));
    await tx.wait();
    console.log("NFT minted successfully!");
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

export async function transferNFT(to, tokenId, value) {
  try {
    // Ensure value is parsed correctly into a BigNumber
    const tx = await contract.transferNFT(to, tokenId, {
      value: parseUnits(value.toString(), "wei"),
    });
    await tx.wait();
    console.log("NFT transferred successfully!");
  } catch (error) {
    console.error("Error transferring NFT:", error);
  }
}

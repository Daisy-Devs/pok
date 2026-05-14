import { ethers } from "ethers";
import provider from "../utils/blockchain.mjs";
import contractJson from "../abi/contract.json" with { type: "json" };

const contractAddress = process.env.CONTRACT_ADDRESS;

if (!contractAddress) {
  throw new Error("❌ CONTRACT_ADDRESS missing in .env");
}

// ✅ FIX HERE
const contract = new ethers.Contract(
  contractAddress,
  contractJson, // 👈 DIRECT ABI ARRAY
  provider
);

export default contract;
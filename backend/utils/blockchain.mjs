import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// 🧪 TEST CONNECTION (temporary)
provider.getBlockNumber().then(block => {
  console.log("📦 Connected to blockchain. Block:", block);
}).catch(err => {
  console.error("❌ Blockchain connection failed:", err);
});

export default provider;
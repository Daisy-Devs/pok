import { ethers } from "ethers";

const provider = new ethers.WebSocketProvider(
  `wss://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
);

// 🧪 TEST CONNECTION (temporary)
provider.getBlockNumber().then(block => {
  console.log("📦 Connected to blockchain. Block:", block);
}).catch(err => {
  console.error("❌ Blockchain connection failed:", err);
});

export default provider;
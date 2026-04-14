import { campaignQueue } from "../queues/campaignQueue.mjs";
import { ethers } from "ethers";
import contract from "../config/contract.mjs";

export const startWorker = () => {
  console.log("🚀 Worker started...");

  setInterval(async () => {
    try {
      const job = await campaignQueue.getJob();

      if (!job) return;

      const data = JSON.parse(job);

      console.log("📦 Processing:", data);

      const privateKey = process.env.PRIVATE_KEY;

      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

      const signer = new ethers.Wallet(privateKey, provider);

      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.setCampaignOwner(
        data.campaignIdBytes32,
        data.ngoWallet
      );

      await tx.wait();

      console.log("✅ Blockchain updated:", tx.hash);

      // TODO: update MongoDB here if needed

    } catch (err) {
      console.error("❌ Worker error:", err.message);
    }
  }, 3000);
};
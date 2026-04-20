import { campaignQueue } from "../queues/campaignQueue.mjs";
import { ethers } from "ethers";
import contract from "../config/contract.mjs";

export const startWorker = async () => {
  console.log("🚀 Worker started...");

  const privateKey = process.env.PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(privateKey, provider);
  const contractWithSigner = contract.connect(signer);

  while (true) {
    let data = null;

    try {
      const job = await campaignQueue.getJob();

      if (!job) {
        await new Promise((r) => setTimeout(r, 3000));
        continue;
      }

      data = job;

      console.log("📦 Processing:", data);

      // ✅ ADD THIS HERE (VERY IMPORTANT)
      const campaign = await Campaign.findOne({
        campaignIdBytes32: data.campaignIdBytes32
      });

      if (!campaign || campaign.onChain) {
        console.log("⏭️ Already processed or missing, skipping");
        continue;
      }

      // ✅ ONLY AFTER CHECK → call blockchain
      const tx = await contractWithSigner.setCampaignOwner(
        data.campaignIdBytes32,
        data.ngoWallet
      );

      await tx.wait();

      console.log("✅ Blockchain updated:", tx.hash);

      await Campaign.updateOne(
        { campaignIdBytes32: data.campaignIdBytes32 },
        {
          txHash: tx.hash,
          onChain: true,
          onChainStatus: "success"
        }
      );

    } catch (err) {
      console.error("❌ Worker error:", err.message);

      if (data) {
        const campaign = await Campaign.findOne({
          campaignIdBytes32: data.campaignIdBytes32
        });

        if (campaign) {
          const retryCount = campaign.retryCount || 0;

          if (retryCount < 3) {
            await Campaign.updateOne(
              { campaignIdBytes32: data.campaignIdBytes32 },
              { $inc: { retryCount: 1 } }
            );
          } else {
            await Campaign.updateOne(
              { campaignIdBytes32: data.campaignIdBytes32 },
              { onChainStatus: "failed" }
            );
          }
        }
      }
    }
  }
};
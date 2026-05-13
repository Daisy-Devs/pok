import contract from "../config/contract.mjs";
import { ethers } from "ethers";
import { saveWithdraw } from "../services/donation.mjs";
import { Campaign } from "../models/campaign.mjs";

export const startWithdrawListener = () => {
  console.log("Listening to Withdrawn events...");

  contract.on("Withdrawn", async (...args) => {
    try {
      const event = args[args.length - 1];

      const {
        campaignOwner,
        campaignId, // bytes32
        amount,
        token
      } = event.args;

      const txHash = event.log.transactionHash;

      // ✅ Normalize wallet
      const normalizedNgo = campaignOwner.toLowerCase();

      // 🔥 Fetch campaign using bytes32 (source of truth)
      const campaign = await Campaign.findOne({
        campaignIdBytes32: campaignId
      });

      if (!campaign) {
        console.log("❌ Campaign not found for:", campaignId);
        return;
      }

      const readableCampaignId = campaign.id; // ✅ correct ID

      // 💰 Format amount
      let formattedAmount;

      if (token === ethers.ZeroAddress) {
        formattedAmount = ethers.formatEther(amount);
      } else {
        formattedAmount = ethers.formatUnits(amount, 6); // adjust if needed
      }

      // ✅ Save withdraw (store BOTH ids)
      await saveWithdraw({
        campaignId: readableCampaignId,      // readable
        campaignIdBytes32: campaignId,       // blockchain
        ngoWallet: normalizedNgo,
        amount: formattedAmount,
        token,
        txHash
      });

      console.log("✅ Withdraw saved:", readableCampaignId);
      
      const current = BigInt(campaign.raisedAmount || "0");
      const updated = current - BigInt(amount);

      campaign.raisedAmount = updated.toString();
      await campaign.save();

      console.log("✅ Withdraw processed & campaign updated");

    } catch (err) {
      console.error("❌ Withdraw listener error:", err.message);
    }
  });
};
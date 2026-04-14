import contract from "../config/contract.mjs";
import { ethers } from "ethers";
import { saveWithdraw } from "../services/donation.mjs";

export const startWithdrawListener = () => {
  console.log("Listening to Withdrawn events...");

  contract.on("Withdrawn", async (...args) => {
    try {
      const event = args[args.length - 1];

      const {
        campaignOwner,
        campaignId,
        amount,
        token
      } = event.args;

      const txHash = event.log.transactionHash;

      // ✅ Normalize wallet
      const normalizedNgo = campaignOwner.toLowerCase();

      // ✅ Decode campaignId
      let readableCampaignId;
      try {
        readableCampaignId = ethers.decodeBytes32String(campaignId);
      } catch {
        readableCampaignId = campaignId;
      }

      // 💰 Format amount
      let formattedAmount;

      if (token === ethers.ZeroAddress) {
        formattedAmount = ethers.formatEther(amount);
      } else {
        formattedAmount = ethers.formatUnits(amount, 6); // adjust later
      }

      // ✅ Save withdraw
      await saveWithdraw({
        campaignId: readableCampaignId,
        ngoWallet: normalizedNgo,
        amount: formattedAmount,
        token,
        txHash
      });

    } catch (err) {
      console.error("❌ Withdraw listener error:", err.message);
    }
  });
};
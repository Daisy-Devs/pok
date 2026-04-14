import contract from "../config/contract.mjs";
import { ethers } from "ethers";
import { saveDonation } from "../services/donation.mjs";
import { User } from "../models/user.mjs";

export const startDonationListener = () => {
  console.log("Listening to DonationReceived events...");

  contract.on("DonationReceived", async (...args) => {
    try {
      const event = args[args.length - 1];

      const {
        donor,
        campaignId,
        campaignOwner,
        amount,
        isAnonymous,
        token
      } = event.args;

      const txHash = event.log.transactionHash;

      // ✅ Normalize addresses
      const normalizedDonor = donor.toLowerCase();
      const normalizedNgo = campaignOwner.toLowerCase();

      // ✅ Decode campaignId (bytes32 → string)
      let readableCampaignId;
      try {
        readableCampaignId = ethers.decodeBytes32String(campaignId);
      } catch {
        readableCampaignId = campaignId; // fallback
      }

      // 💰 Format amount
      let formattedAmount;

      if (token === ethers.ZeroAddress) {
        formattedAmount = ethers.formatEther(amount);
      } else {
        // ⚠️ assuming 6 decimals (USDC) — adjust later if needed
        formattedAmount = ethers.formatUnits(amount, 6);
      }

      // 🔥 Fetch user (only if not anonymous)
      let donorName = "Anonymous";
      let userId = null;

      if (!isAnonymous) {
        const user = await User.findOne({
          walletAddress: normalizedDonor
        });

        if (user) {
          donorName = user.name || "Unknown";
          userId = user._id;
        }
      }

      // ✅ Save donation
      await saveDonation({
        donor: normalizedDonor,
        campaignId: readableCampaignId,
        ngoWallet: normalizedNgo,
        amount: formattedAmount,
        token,
        isAnonymous,
        donorName,
        userId,
        txHash
      });

    } catch (err) {
      console.error("❌ Listener error:", err.message);
    }
  });
};
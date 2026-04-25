import contract from "../config/contract.mjs";
import { ethers } from "ethers";
import { saveDonation } from "../services/donation.mjs";
import { User } from "../models/user.mjs";
import { Campaign } from "../models/campaign.mjs";

export const startDonationListener = () => {
  console.log("Listening to DonationReceived events...");

  contract.on("DonationReceived", async (...args) => {
    try {
      const event = args[args.length - 1];

      const {
        donor,
        campaignId, // bytes32 from contract
        campaignOwner,
        amount,
        isAnonymous,
        token
      } = event.args;

      const txHash = event.log.transactionHash;

      const normalizedDonor = donor.toLowerCase();
      const normalizedNgo = campaignOwner.toLowerCase();

      // 🔥 IMPORTANT: find campaign using bytes32
      const campaign = await Campaign.findOne({
        campaignIdBytes32: campaignId
      });

      if (!campaign) {
        console.log("❌ Campaign not found for:", campaignId);
        return;
      }

      const readableCampaignId = campaign.id; // ✅ ALWAYS correct

      // 💰 Format amount
      let formattedAmount;

      if (token === ethers.ZeroAddress) {
        formattedAmount = ethers.formatEther(amount);
      } else {
        formattedAmount = ethers.formatUnits(amount, 6);
      }

      // 🔥 Fetch user
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

      // ✅ Save donation (NOW PERFECT)
      await saveDonation({
        donor: normalizedDonor,
        campaignId: readableCampaignId, // ✅ normal ID
        campaignIdBytes32: campaignId,  // ✅ store this also (recommended)
        ngoWallet: normalizedNgo,
        amount: formattedAmount,
        token,
        isAnonymous,
        donorName,
        userId,
        txHash
      });

      console.log("✅ Donation saved:", readableCampaignId);

      const current = BigInt(campaign.raisedAmount || "0");
      const updated = current + BigInt(amount);

      campaign.raisedAmount = updated.toString();
      await campaign.save();

      console.log("✅ Donation processed & campaign updated");

    } catch (err) {
      console.error("❌ Listener error:", err.message);
    }
  });
};
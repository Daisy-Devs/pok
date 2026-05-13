import contract from "../config/contract.mjs";
import { ethers } from "ethers";
import { saveDonation } from "../services/donation.mjs";
import { User } from "../models/user.mjs";
import { Campaign } from "../models/campaign.mjs";
import { DonationRecord } from "../models/donationRecord.mjs";

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
        token,
      } = event.args;

      console.log("🔥 Event received");
      console.log("DB campaignIdBytes32:", campaignId);
        // Get the transaction receipt
  const receipt = await event.getTransactionReceipt();

  if (receipt.status === 0) {
    console.error("Transaction failed!", receipt.transactionHash);
    return;
  }
  console.log("receipt stats",receipt.status);
  
      const txHash = event.log.transactionHash;

      const normalizedDonor = donor.toLowerCase();
      const normalizedNgo = campaignOwner.toLowerCase();

      // 🔥 Find campaign using bytes32
      const campaign = await Campaign.findOne({
        campaignIdBytes32: campaignId.toLowerCase()
      });

      if (!campaign) {
        console.log("❌ Campaign not found for:", campaignId);
        return;
      }

      const readableCampaignId = campaign.id;

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
        const user = await User.findOne({ walletAddress: normalizedDonor });
        if (user) {
          donorName = user.name || "Unknown";
          userId = user._id;
        }
      }

      // ✅ Save donation
      await saveDonation({
        donor: normalizedDonor,
        campaignId: readableCampaignId,
        campaignIdBytes32: campaignId,
        ngoWallet: normalizedNgo,
        amount: formattedAmount,
        token,
        isAnonymous,
        donorName,
        userId,
        txHash,
        status: receipt.status === 1 ? "success" : "failed"
      });

      console.log("✅ Donation saved:", readableCampaignId);

      // ✅ Aggregate total from DB
      const stats = await DonationRecord.aggregate([
        { $match: { campaignId: campaign.id } },
        { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } }
      ]);

      // ✅ Add current donation to handle race condition
      const totalRaised = stats[0]?.total || 0; // ✅ already includes current donation, don't add again
      const goal = Number(campaign.goalAmount);

      console.log(`📊 totalRaised: ${totalRaised}, goal: ${goal}`);

       // ✅ Mark completed only when goal is truly reached
      if (campaign.status !== "completed" && totalRaised >= goal && receipt.status === 1) {
        campaign.status = "completed";
        campaign.completedAt = new Date();
        await campaign.save();
        console.log("🏁 Campaign marked as completed:", readableCampaignId);
      }

      console.log("✅ Donation processed & campaign updated");

    } catch (err) {
      console.error("❌ Listener error:", err.message);
    }
  });
};
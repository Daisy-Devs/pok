import { Campaign } from "../models/campaign.mjs";
import { WithdrawRecord } from "../models/withdrawRecord.mjs";
import { sendResponse } from "../utils/response.mjs";

export const getAllWithdrawals = async (req, res) => {
  try {
    const walletAddress = req.walletAddress.toLowerCase();

    // Fetch all withdrawals for this NGO
    const withdrawals = await WithdrawRecord.find({
      ngoWallet: walletAddress,
    }).sort({ createdAt: -1 });
    const withdrawalWithCampaignDetails = await Promise.all(
      withdrawals.map(async (withdrawal) => {
        const campaign = await Campaign.findOne({
          campaignIdBytes32: withdrawal.campaignIdBytes32,
        });        
        return {
          ...withdrawal._doc,
          campaignTitle: campaign.title,
        };
      }),
    );

    // Fetch all campaigns for this NGO
    const campaigns = await Campaign.find({
      ngoWallet: walletAddress,
    });

    // Build balance summary per campaign
    const balances = campaigns.map((c) => {
      const remainingWei = BigInt(c.raisedAmount || "0");
      const remaining = parseFloat(ethers.formatEther(remainingWei));

      return {
        campaignId: c.id,
        campaignTitle: c.title,
        token: c.goalToken,
        remainingBalance: remaining,
      };
    });

    // Format withdrawal amounts for display
    const formattedWithdrawals = withdrawalWithCampaignDetails.map((w) => ({
      ...w,
      amount: parseFloat(w.amount), // already formatted in listener
    }));

    return sendResponse(res, 200, "Withdrawals fetched successfully", {
      count: withdrawals.length,
      withdrawals: formattedWithdrawals,
      balances,
    });
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const getWithdrawalsByCampaign = async (req, res) => {
  try {
    const walletAddress = req.walletAddress.toLowerCase();
    const { campaignId } = req.params;

    const withdrawals = await WithdrawRecord.find({
      campaignId,
      ngoWallet: walletAddress,
    }).sort({ createdAt: -1 });

    return sendResponse(res, 200, "Campaign Withdrawals fetched successfully", {
      count: withdrawals.length,
      data: withdrawals,
    });
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

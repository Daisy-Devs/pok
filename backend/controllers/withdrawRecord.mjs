import { Campaign } from "../models/campaign.mjs";
import { DonationRecord } from "../models/donationRecord.mjs";
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
          campaignToken: campaign.goalToken,
        };
      }),
    );
    // Get organization id
    const orgId = req.ngoId;

    // Fetch all campaigns for this NGO
 const campaigns = await Campaign.find({ organization: orgId });

    // Extract campaign IDs for aggregation
    const campaignIds = campaigns.map((c) => c.id);

    // Aggregate total donations per campaign
    const stats = await DonationRecord.aggregate([
      {
        $match: {
          campaignId: { $in: campaignIds },
        },
      },
      {
        $group: {
          _id: "$campaignId",
          totalAmount: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    // Build a lookup map for quick access: campaignId -> totalDonations
    const donationMap = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.totalAmount;
      return acc;
    }, {});

    // Build balance summary per campaign
    const balances = campaigns.map((c) => {
       const totalDonations = donationMap[c.id] ?? 0;
      const totalWithdrawalAmount = withdrawalWithCampaignDetails
        .filter((w) => w.campaignIdBytes32 === c.campaignIdBytes32)
        .reduce((acc, w) => acc + parseFloat(w.amount), 0);

      const remainingBalance = totalDonations - totalWithdrawalAmount;

      return {
        campaignId: c.id,
        campaignTitle: c.title,
        cause: c.cause,
        token: c.goalToken,
        totalDonations,
        totalWithdrawalAmount,
        remainingBalance,
        campaignIdBytes32: c.campaignIdBytes32,
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

export const getNgoBalance = async (req, res) => {
  try {
    const walletAddress = req.walletAddress.toLowerCase();
    // Fetch all withdrawals for this NGO
    const withdrawals = await WithdrawRecord.find({
      ngoWallet: walletAddress,
    }).sort({ createdAt: -1 });
   
    // Get organization id
    const orgId = req.ngoId;

    // Fetch all campaigns for this NGO
    const campaigns = (await Campaign.find({ organization: orgId })).filter((c) => c.status !== "draft");
        // Extract campaign IDs for aggregation
    const campaignIds = campaigns.map((c) => c.id);

    // Aggregate total donations per campaign
    const stats = await DonationRecord.aggregate([
      {
        $match: {
          campaignId: { $in: campaignIds },
        },
      },
      {
        $group: {
          _id: "$campaignId",
          totalAmount: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    // Build a lookup map for quick access: campaignId -> totalDonations
    const donationMap = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.totalAmount;
      return acc;
    }, {});

    // Build balance summary per campaign
    const balances = campaigns.map((c) => {
       const totalDonations = donationMap[c.id] ?? 0;
      const totalWithdrawalAmount = withdrawals
        .filter((w) => w.campaignIdBytes32 === c.campaignIdBytes32)
        .reduce((acc, w) => acc + parseFloat(w.amount), 0);

      const remainingBalance = totalDonations - totalWithdrawalAmount;

      return {
        campaignId: c.id,
        campaignTitle: c.title,
        cause: c.cause,
        token: c.goalToken,
        totalDonations,
        totalWithdrawalAmount,
        remainingBalance,
        campaignIdBytes32: c.campaignIdBytes32,
      };
    });
    const ethBalance = balances.filter((c) => c.token === "ETH").reduce((acc, c) => acc + c.remainingBalance, 0);
    const usdcBalance = balances.filter((c) => c.token === "USDC").reduce((acc, c) => acc + c.remainingBalance, 0);
    const usdtBalance = balances.filter((c) => c.token === "USDT").reduce((acc, c) => acc + c.remainingBalance, 0);
    const daiBalance = balances.filter((c) => c.token === "DAI").reduce((acc, c) => acc + c.remainingBalance, 0);

    return sendResponse(res, 200, "NGO balance fetched successfully", {
      ETH:ethBalance,
      USDC:usdcBalance,
      USDT:usdtBalance,
      DAI:daiBalance
    })
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

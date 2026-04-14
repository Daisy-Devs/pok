import { WithdrawRecord } from "../models/withdrawRecord.mjs";
import { sendResponse } from "../utils/response.mjs";

export const getAllWithdrawals = async (req, res) => {
  try {
    const walletAddress = req.walletAddress.toLowerCase();

    const withdrawals = await WithdrawRecord.find({
      ngoWallet: walletAddress
    }).sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Withdrawals fetched successfully', {
      count: withdrawals.length,
      data: withdrawals
    });

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const getWithdrawalsByCampaign = async (req, res) => {
  try {
    const walletAddress = req.walletAddress.toLowerCase();
    const { campaignId } = req.params;

    const withdrawals = await WithdrawRecord.find({ campaignId, ngoWallet: walletAddress })
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Campaign Withdrawals fetched successfully', {
      count: withdrawals.length,
      data: withdrawals
    });

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};
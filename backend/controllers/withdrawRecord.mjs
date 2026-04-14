import { WithdrawRecord } from "../models/withdrawRecord.mjs";
import { sendResponse } from "../utils/response.mjs";

export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await WithdrawRecord.find()
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Withdrawals fetched successfully', {
      count: withdrawals.length,
      data: withdrawals
    });

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const getWithdrawalsByNgo = async (req, res) => {
  try {
    const { wallet } = req.params;

    const withdrawals = await WithdrawRecord.find({
      ngoWallet: wallet.toLowerCase()
    }).sort({ createdAt: -1 });

    return sendResponse(res, 200, 'NGO Withdrawals fetched successfully', {
      count: withdrawals.length,
      data: withdrawals
    });

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const getWithdrawalsByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const withdrawals = await WithdrawRecord.find({ campaignId })
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Campaign Withdrawals fetched successfully', {
      count: withdrawals.length,
      data: withdrawals
    });

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};
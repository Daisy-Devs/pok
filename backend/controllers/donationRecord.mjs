import { DonationRecord } from "../models/donationRecord.mjs";
import { sendResponse } from "../utils/response.mjs";

export const getAllDonations = async (req, res) => {
  try {
    const donations = await DonationRecord.find()
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Donations fetched successfully', {
      count: donations.length,
      data: donations
    });

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const getDonationsByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const donations = await DonationRecord.find({ campaignId })
      .sort({ createdAt: -1 })
      .select("-_id -__v");

    return sendResponse(res, 200, "Campaign Donations fetched successfully", {
      count: donations.length,
      donations
    });

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const getDonationsByDonor = async (req, res) => {
  try {
    const userId = req.userId;

    const donations = await DonationRecord.find({ userId }).sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Donor Donations fetched successfully', {
      count: donations.length,
      donations
    });

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};
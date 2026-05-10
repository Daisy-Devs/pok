import { DonationRecord } from "../models/donationRecord.mjs";
import { Organization } from "../models/organization.mjs";
import {Campaign} from "../models/campaign.mjs";
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

export const getDonationsByOrg = async (req, res) => {
  try {
    const ngoId = req.ngoId;

    const org = await Organization.findById(ngoId);

    if (!org) {
      return sendResponse(res, 404, "Organization not found");
    }

    const {
      page = 1,
      limit = 5,
      days,
      goalToken,
      cause
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // ✅ FIX: use wallet from DB/auth
    const normalizedWallet = org.walletAddress.toLowerCase();

    // 📅 Date filter
    let dateFilter = {};
    if (days) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Number(days));
      dateFilter.createdAt = { $gte: pastDate };
    }

    // ✅ Base match (reusable)
    const baseMatch = {
      ngoWallet: normalizedWallet,
      ...dateFilter
    };

    // 🔥 MAIN PIPELINE
    const pipeline = [
      { $match: baseMatch },

      // 🔗 Join Campaign
      {
        $lookup: {
          from: "campaigns",
          localField: "campaignId",
          foreignField: "id",
          as: "campaign"
        }
      },
      { $unwind: "$campaign" },

      // 🎯 Filters
      {
        $match: {
          ...(goalToken && { "campaign.goalToken": goalToken }),
          ...(cause && { "campaign.cause": cause })
        }
      },

      // 🔗 Join User
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      // 💰 Safe amount conversion
      {
        $addFields: {
          amountNumber: {
            $convert: {
              input: "$amount",
              to: "double",
              onError: 0,
              onNull: 0
            }
          }
        }
      },

      // 📦 Shape response
      {
        $project: {
          donor: 1,
          donorName: 1,
          isAnonymous: 1,
          amount: "$amountNumber",
          token: 1,
          txHash: "$transactionHash",
          createdAt: 1,

          // ✅ Use DB status (correct)
          status: 1,

          campaignTitle: "$campaign.title",
          cause: "$campaign.cause",
          goalToken: "$campaign.goalToken",

          donorProfileImage: "$user.profileImage"
        }
      },

      // 📊 Sort
      { $sort: { createdAt: -1 } },

      // 📄 Pagination
      { $skip: skip },
      { $limit: limitNumber }
    ];

    const donations = await DonationRecord.aggregate(pipeline);

    // 📊 TOTAL COUNT (WITH SAME FILTERS)
    const totalRecordsAgg = await DonationRecord.aggregate([
      { $match: baseMatch },

      {
        $lookup: {
          from: "campaigns",
          localField: "campaignId",
          foreignField: "id",
          as: "campaign"
        }
      },
      { $unwind: "$campaign" },

      {
        $match: {
          ...(goalToken && { "campaign.goalToken": goalToken }),
          ...(cause && { "campaign.cause": cause })
        }
      },

      { $count: "count" }
    ]);

    const totalRecords = totalRecordsAgg[0]?.count || 0;

    // 👥 Unique donors
    const uniqueDonorsAgg = await DonationRecord.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$donor" } },
      { $count: "total" }
    ]);

    const totalUniqueDonors = uniqueDonorsAgg[0]?.total || 0;

    // 📅 Monthly revenue
    const monthlyRevenue = await DonationRecord.aggregate([
      { $match: baseMatch },

      {
        $addFields: {
          amountNumber: {
            $convert: {
              input: "$amount",
              to: "double",
              onError: 0,
              onNull: 0
            }
          }
        }
      },

      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$amountNumber" }
        }
      },

      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    return sendResponse(res, 200, "Donations fetched successfully", {
      page: pageNumber,
      limit: limitNumber,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limitNumber),

      totalUniqueDonors,
      monthlyRevenue,

      donations
    });

  } catch (err) {
    console.error("❌ Error:", err);
    return sendResponse(res, 500, err.message);
  }
};

export const markDonationFailed = async (req, res) => {
  try {
    const {
      txHash,
      donor,
      campaignId,
      campaignIdBytes32,
      amount,
      token,
      ngoWallet,
      isAnonymous = false,
      donorName = "Anonymous",
      userId = null
    } = req.body;

    if (!txHash) {
      return sendResponse(res, 400, "txHash is required");
    }

    // 🔍 Check if already exists
    const existing = await DonationRecord.findOne({
      transactionHash: txHash
    });

    // 🔁 If exists → update safely
    if (existing) {
      // ✅ Don't override success
      if (existing.status === "success") {
        return sendResponse(res, 200, "Already successful, not updating", existing);
      }

      existing.status = "failed";
      await existing.save();

      return sendResponse(res, 200, "Marked as failed", existing);
    }

    // 🆕 If not exists → create FULL record
    const donation = await DonationRecord.create({
      donor: donor?.toLowerCase(),
      campaignId,
      campaignIdBytes32,
      ngoWallet: ngoWallet?.toLowerCase(),
      amount,
      token,
      isAnonymous,
      donorName,
      userId,
      transactionHash: txHash,
      status: "failed"
    });

    return sendResponse(res, 200, "Failed donation saved", donation);

  } catch (err) {
    console.error("❌ Error:", err.message);
    return sendResponse(res, 500, err.message);
  }
};
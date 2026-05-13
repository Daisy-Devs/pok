import { Campaign } from "../models/campaign.mjs";
import { DonationRecord } from "../models/donationRecord.mjs";
import { Organization } from "../models/organization.mjs";
import { sendResponse } from "../utils/response.mjs";

export const getAllDonations = async (req, res) => {
  try {
    const donations = await DonationRecord.find().sort({ createdAt: -1 });

    return sendResponse(res, 200, "Donations fetched successfully", {
      count: donations.length,
      data: donations,
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
      donations,
    });
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const getDonationsByDonor = async (req, res) => {
  try {
    const userId = req.userId;
    const donations = await DonationRecord.find({ userId }).sort({
      createdAt: -1,
    });

    const donationWithCampaignDetails = await Promise.all(
      donations.map(async (donation) => {
        const campaign = await Campaign.findOne({
          campaignIdBytes32: donation.campaignIdBytes32,
        });
        return {
          ...donation._doc,
          campaignTitle: campaign.title,
          campaignCause: campaign.cause,
        };
      }),
    );
    return sendResponse(res, 200, "Donor Donations fetched successfully", {
      count: donations.length,
      donations: donationWithCampaignDetails,
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
      cause,
      export: isExport,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const normalizedWallet = org.walletAddress.toLowerCase();

    
    let baseMatch = { ngoWallet: normalizedWallet };
    if (days && days !== "all") {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Number(days));
      baseMatch.createdAt = { $gte: pastDate };
    }

   
    const sharedPipeline = [
      { $match: baseMatch },
      {
        $lookup: {
          from: "campaigns",
          localField: "campaignId",
          foreignField: "id",
          as: "campaign",
        },
      },
      { $unwind: "$campaign" },
      {
        $match: {
          ...(goalToken &&
            goalToken !== "all" && { "campaign.goalToken": goalToken }),
          ...(cause && { "campaign.cause": { $regex: cause, $options: "i" } }),
        },
      },
    ];

    // 3. HANDLE CSV EXPORT CASE
    if (isExport === "true") {
      const exportData = await DonationRecord.aggregate([
        ...sharedPipeline,
        { $sort: { createdAt: -1 } },
        {
          $project: {
            donorName: { $ifNull: ["$donorName", "Anonymous"] },
            donor: 1,
            amount: 1,
            asset: "$campaign.goalToken",
            campaignTitle: "$campaign.title",
            cause: "$campaign.cause",
            createdAt: 1,
            txHash: "$transactionHash",
            status: 1,
          },
        },
      ]);

      const headers = [
        "Donor Name",
        "Wallet Address",
        "Amount",
        "Asset",
        "Campaign",
        "Cause",
        "Date",
        "Transaction Hash",
        "Status",
      ];
      const rows = exportData.map((d) => {
        return [
          d.donorName,
          d.donor,
          d.amount,
          d.asset,
          d.campaignTitle,
          d.cause,
          new Date(d.createdAt).toLocaleString(),
          d.txHash || "N/A",
          d.status === "success" ? "CONFIRMED" : "FAILED",
        ]
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",");
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=donation-history-${Date.now()}.csv`,
      );

      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

      // Send the actual CSV string
      return res.status(200).send([headers.join(","), ...rows].join("\n"));
    }

    
    const donations = await DonationRecord.aggregate([
      ...sharedPipeline,
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          amountNumber: {
            $convert: {
              input: "$amount",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      {
        $project: {
          donor: 1,
          donorName: 1,
          isAnonymous: 1,
          amount: "$amountNumber",
          token: 1,
          txHash: "$transactionHash",
          createdAt: 1,
          status: 1,
          campaignTitle: "$campaign.title",
          cause: "$campaign.cause",
          goalToken: "$campaign.goalToken",
          donorProfileImage: "$user.profileImage",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNumber },
    ]);

    
    const totalRecordsAgg = await DonationRecord.aggregate([
      ...sharedPipeline,
      { $count: "count" },
    ]);
    const totalRecords = totalRecordsAgg[0]?.count || 0;

    
    const uniqueDonorsAgg = await DonationRecord.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$donor" } },
      { $count: "total" },
    ]);
    const totalUniqueDonors = uniqueDonorsAgg[0]?.total || 0;

    
    const monthlyRevenue = await DonationRecord.aggregate([
      { $match: baseMatch },
      {
        $addFields: {
          amountNumber: {
            $convert: { input: "$amount", to: "double", onError: 0, onNull: 0 },
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$amountNumber" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    // 8. FINAL RESPONSE
    return sendResponse(res, 200, "Donations fetched successfully", {
      page: pageNumber,
      limit: limitNumber,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limitNumber),
      totalUniqueDonors,
      monthlyRevenue,
      donations,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return sendResponse(res, 500, err.message);
  }
};

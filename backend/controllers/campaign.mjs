import { Campaign, DonationRecord, Organization } from "../models/index.mjs";
import { v4 as uuidv4 } from "uuid";
import { sendResponse } from "../utils/response.mjs";
import { campaignQueue } from "../queues/campaignQueue.mjs";
import { ethers } from "ethers";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
export const createOrgAndCampaign = async (req, res) => {
  try {
    const walletAddress = req.walletAddress;
    let body = { ...req.body };

    console.log("📥 RAW BODY:", body);

    // 🔥 STEP 2: Normalize (VERY IMPORTANT)
    body.documents = Array.isArray(body.documents) ? body.documents : [];
    body.imageUrl = Array.isArray(body.imageUrl) ? body.imageUrl : [];
    body.profileImage =
      body.profileImage && typeof body.profileImage === "object"
        ? body.profileImage
        : {};

    console.log("🧾 NORMALIZED:", body);

    // 🔥 STEP 3: Validate AFTER parsing
    const error = validateCampaignInput(body);
    if (error) {
      return sendResponse(res, 400, error);
    }

    const {
      organizationName,
      taxId,
      email,
      country,
      website,
      profileImage,
      documents,
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      goalToken,
      status,
    } = body;

    const normalizedToken = goalToken.toUpperCase();

    // 🔹 Find or create org
    let organization = await Organization.findOne({ walletAddress });

    if (organization && organization.isProfileComplete) {
      return sendResponse(res, 400, "Organization already exists");
    }

    if (!organization) {
      organization = new Organization({ walletAddress });
    }

    // 🔥 SAFE ASSIGNMENT
    organization.name = organizationName.trim();
    organization.taxId = taxId.trim();
    organization.email = email.trim();
    organization.country = country;
    organization.website = website;
    organization.profileImage = profileImage;
    organization.documents = documents;
    organization.isProfileComplete = true;

    await organization.save();

    // 🔹 Campaign
    const campaignId = `campaign-${uuidv4()}`;
    const campaignIdBytes32 = ethers.id(campaignId);

    const campaign = await Campaign.create({
      id: campaignId,
      campaignIdBytes32: campaignIdBytes32,
      organization: organization._id,
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      goalToken: normalizedToken,
      status: status || "active",
      onChainStatus: "pending",
    });

    await campaignQueue.addJob({
      campaignIdBytes32,
      ngoWallet: walletAddress,
    });

    return sendResponse(res, 201, "Campaign created successfully", {
      organization,
      campaign,
    });
  } catch (error) {
    console.error("❌ FINAL ERROR:", error);
    return sendResponse(res, 500, error.message);
  }
};

export const createCampaign = async (req, res) => {
  try {
    const ngoId = req.ngoId;
    const walletAddress = req.walletAddress.toLowerCase();

    const {
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      goalToken,
      status,
    } = req.body;

    const normalizedToken = goalToken.toUpperCase();

    const organization = await Organization.findById(ngoId);

    if (!organization) {
      return sendResponse(res, 404, "Organization not found");
    }

    if (missionStatement == "" && status !== "draft") {
      return sendResponse(res, 400, "Mission Statement is required");
    }
    if (organization.walletAddress.toLowerCase() !== walletAddress) {
      return sendResponse(res, 403, "Unauthorized NGO");
    }

    // ✅ Generate IDs
    const campaignId = `campaign-${uuidv4()}`;
    const campaignIdBytes32 = ethers.id(campaignId);

    const campaign = new Campaign({
      id: campaignId,
      campaignIdBytes32: campaignIdBytes32,
      organization: organization._id,
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      goalToken: normalizedToken,
      status: status || "active",
      onChainStatus: "pending",
    });

    await campaign.save();

    // ✅ Queue job
    await campaignQueue.addJob({
      campaignIdBytes32,
      ngoWallet: walletAddress,
    });

    return sendResponse(res, 201, "Campaign created successfully", campaign);
  } catch (error) {
    console.error("❌ Error:", error);
    return sendResponse(res, 500, error.message);
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const ngoId = req.ngoId;
    const { id } = req.params;
    const {
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      status,
      goalToken,
    } = req.body;

    const campaign = await Campaign.findOne({
      _id: new ObjectId(id),
      organization: ngoId,
    });
    if (!campaign) {
      return sendResponse(res, 404, "Campaign not found");
    }

    // ❌ Restriction: Only draft can be updated
    if (campaign.status !== "draft") {
      return sendResponse(res, 400, "Only draft campaigns can be updated");
    }
    // ✅ Update allowed fields
    if (title !== undefined) campaign.title = title;
    if (missionStatement !== undefined)
      campaign.missionStatement = missionStatement;
    if (cause !== undefined) campaign.cause = cause;
    if (imageUrl !== undefined) campaign.imageUrl = imageUrl;
    if (goalAmount !== undefined) campaign.goalAmount = goalAmount;
    if (goalToken !== undefined) campaign.goalToken = goalToken?.toUpperCase();

    // ✅ Allow changing status (draft → active)
    if (status) campaign.status = status;

    await campaign.save();

    return sendResponse(res, 200, "campaigns updated successfully", campaign);
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 6,
      search,
      cause,
      location,
      tag,
      status,
      goalToken,
      sortBy = "latest",
      view = "list",
      limitPerCause = 6,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    limitPerCause = parseInt(limitPerCause);

    if (page < 1) page = 1;

    // =========================================================
    // ✅ Common Filter
    // =========================================================
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ["active", "completed"] };
    }

    if (cause) {
      filter.cause = {
        $regex: `^${cause.trim()}$`,
        $options: "i",
      };
    }
    if (goalToken) filter.goalToken = goalToken.toUpperCase();

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (tag) {
      filter.tags = { $in: [new RegExp(tag, "i")] };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { cause: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    // =========================================================
    // ✅ Sorting
    // =========================================================
    let sortOption = { createdAt: -1 };

    if (sortBy === "oldest") sortOption = { createdAt: 1 };
    if (sortBy === "goal_high") sortOption = { goalAmount: -1 };
    if (sortBy === "goal_low") sortOption = { goalAmount: 1 };

    // =========================================================
    // 🧠 Helper: Attach funding stats (ONLY totalRaised)
    // =========================================================
    const attachFundingStats = async (campaigns) => {
      if (!campaigns.length) return campaigns;

      // ✅ ALWAYS use custom campaignId string
      const campaignIds = campaigns.map((c) => c.id);

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

      const statsMap = {};
      stats.forEach((item) => {
        statsMap[item._id] = item.totalAmount;
      });

      return campaigns.map((campaign) => {
        const totalRaised = statsMap[campaign.id] || 0;
        const goal = Number(campaign.goalAmount);

        return {
          ...campaign.toObject(),
          totalRaised,
          isGoalReached: totalRaised >= goal,
        };
      });
    };
    // =========================================================
    // 🔥 MODE 1: GROUPED
    // =========================================================
    if (view === "grouped" && !cause) {
      const pipeline = [
        { $match: filter },
        { $sort: sortOption },
        {
          $group: {
            _id: { $toLower: { $ifNull: ["$cause", "Others"] } },
            campaigns: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            cause: "$_id",
            campaigns: { $slice: ["$campaigns", limitPerCause] },
          },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ];

      const groupedData = await Campaign.aggregate(pipeline);

      // populate organization
      const populated = await Campaign.populate(groupedData, {
        path: "campaigns.organization",
        select: "name email walletAddress profileImage",
      });

      // 👉 attach funding stats per group
      for (let group of populated) {
        group.campaigns = await attachFundingStats(group.campaigns);
      }

      // total causes count
      const totalCausesAgg = await Campaign.aggregate([
        { $match: filter },
        {
          $group: {
            _id: { $toLower: { $ifNull: ["$cause", "Others"] } },
          },
        },
        { $count: "total" },
      ]);

      const totalCauses = totalCausesAgg[0]?.total || 0;

      return sendResponse(res, 200, "Grouped campaigns fetched", {
        page,
        totalPages: Math.ceil(totalCauses / limit),
        totalCauses,
        count: populated.length,
        causes: populated,
      });
    }

    // =========================================================
    // 🔥 MODE 2: LIST
    // =========================================================
    const total = await Campaign.countDocuments(filter);

    const campaigns = await Campaign.find(filter)
      .select("-__v")
      .populate("organization", "name email walletAddress profileImage")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const updatedCampaigns = await attachFundingStats(campaigns);

    return sendResponse(res, 200, "Campaigns fetched successfully", {
      page,
      totalPages: Math.ceil(total / limit),
      totalCampaigns: total,
      count: updatedCampaigns.length,
      campaigns: updatedCampaigns,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return sendResponse(res, 500, error.message);
  }
};

export const getCampaignsByOrganization = async (req, res) => {
  try {
    const ngoId = req.ngoId;

    const org = await Organization.findById(ngoId);

    if (!org) {
      return sendResponse(res, 404, "Organization not found");
    }

    const {
      page = 1,
      limit = 6,
      status, // all | active | completed | draft
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // 🔥 Base filter
    let campaignFilter = { organization: ngoId };

    if (status && status !== "all") {
      campaignFilter.status = status;
    }

    // 📊 Fetch campaigns
    const campaigns = await Campaign.find(campaignFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalCampaigns = await Campaign.countDocuments(campaignFilter);

    if (!campaigns.length) {
      return sendResponse(res, 200, "No campaigns found", {
        page: pageNumber,
        limit: limitNumber,
        totalCampaigns,
        totalPages: Math.ceil(totalCampaigns / limitNumber),

        totalRaised: 0,
        activeDonors: 0,
        successRate: 0,

        campaigns: [],
      });
    }

    // 🆔 Campaign IDs
    const campaignIds = campaigns.map((c) => c.id);

    const normalizedWallet = org.walletAddress.toLowerCase();

    // 💰 Aggregate donation stats
    const donationStats = await DonationRecord.aggregate([
      {
        $match: {
          ngoWallet: normalizedWallet,
          campaignId: { $in: campaignIds },
        },
      },
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
        $group: {
          _id: "$campaignId",
          totalRaised: { $sum: "$amountNumber" },
          donors: { $addToSet: "$donor" },
        },
      },
    ]);

    // 🔁 Map stats
    const statsMap = {};
    donationStats.forEach((item) => {
      statsMap[item._id] = item;
    });

    // 📊 Total Raised (overall)
    const totalRaisedAgg = await DonationRecord.aggregate([
      { $match: { ngoWallet: normalizedWallet } },
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
        $group: {
          _id: null,
          total: { $sum: "$amountNumber" },
        },
      },
    ]);

    const totalRaised = totalRaisedAgg[0]?.total || 0;

    // 👥 Active donors (unique)
    const donorsAgg = await DonationRecord.aggregate([
      { $match: { ngoWallet: normalizedWallet } },
      { $group: { _id: "$donor" } },
      { $count: "count" },
    ]);

    const activeDonors = donorsAgg[0]?.count || 0;

    // 📈 Success rate
    const allCampaignsCount = await Campaign.countDocuments({
      organization: ngoId,
    });

    const completedCampaigns = await Campaign.countDocuments({
      organization: ngoId,
      status: "completed",
    });

    const successRate =
      allCampaignsCount > 0
        ? Number(((completedCampaigns / allCampaignsCount) * 100).toFixed(2))
        : 0;

    // 🔄 Attach progress
    const updatedCampaigns = campaigns.map((campaign) => {
      const stat = statsMap[campaign.id] || {
        totalRaised: 0,
        donors: [],
      };

      const goal = Number(campaign.goalAmount);

      const progressPercent =
        goal > 0 ? Number(((stat.totalRaised / goal) * 100).toFixed(2)) : 0;

      return {
        ...campaign,
        totalRaised: stat.totalRaised,
        totalDonors: stat.donors.length,
        progressPercent,
        isGoalReached: stat.totalRaised >= goal,
      };
    });

    return sendResponse(res, 200, "Dashboard fetched successfully", {
      page: pageNumber,
      limit: limitNumber,
      totalCampaigns,
      totalPages: Math.ceil(totalCampaigns / limitNumber),

      totalRaised,
      activeDonors,
      successRate,

      campaigns: updatedCampaigns,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return sendResponse(res, 500, err.message);
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;

    // 1️⃣ Fetch campaign
    const campaign = await Campaign.findOne({ id: campaignId })
      .select("-__v")
      .populate(
        "organization",
        "name email walletAddress website profileImage documents",
      );

    if (!campaign) {
      return sendResponse(res, 404, "Campaign not found");
    }

    // 2️⃣ Aggregate stats for THIS campaign
    const stats = await DonationRecord.aggregate([
      {
        $match: {
          campaignId: campaignId,
        },
      },
      {
        $group: {
          _id: "$campaignId",
          uniqueDonors: { $addToSet: "$donor" },
          totalAmount: {
            $sum: { $toDouble: "$amount" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalDonors: { $size: "$uniqueDonors" },
          totalRaised: "$totalAmount",
        },
      },
    ]);

    const stat = stats[0] || {
      totalDonors: 0,
      totalRaised: 0,
    };

    // 3️⃣ Progress calculation
    const goal = Number(campaign.goalAmount);

    const progressPercent =
      goal > 0 ? Number(((stat.totalRaised / goal) * 100).toFixed(2)) : 0;

    // 4️⃣ Final response
    const result = {
      ...campaign.toObject(),
      totalDonors: stat.totalDonors,
      totalRaised: stat.totalRaised,
      progressPercent,
      isGoalReached: stat.totalRaised >= goal,
    };

    return sendResponse(res, 200, "Campaign fetched successfully", result);
  } catch (error) {
    console.error("❌ Error:", error);
    return sendResponse(res, 500, error.message);
  }
};

const validateCampaignInput = (body) => {
  const {
    organizationName,
    taxId,
    email,
    country,
    website,
    title,
    missionStatement,
    cause,
    goalAmount,
    goalToken,
    imageUrl,
    documents,
    profileImage,
    status,
  } = body;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidUrl = (url) =>
    typeof url === "string" && url.startsWith("https://res.cloudinary.com/");

  const isValidWebsite = (url) =>
    typeof url === "string" && url.startsWith("https://");

  const isValidMediaObject = (obj) =>
    obj &&
    typeof obj === "object" &&
    typeof obj.url === "string" &&
    isValidUrl(obj.url);

  // 🔹 Required
  if (
    !organizationName?.trim() ||
    !taxId?.trim() ||
    !email?.trim() ||
    !country
  ) {
    return "Name, Tax Id, email, and country are required";
  }

  if (!title || !missionStatement || !cause || !goalAmount || !goalToken) {
    return "All campaign fields are required";
  }

  if (!isValidEmail(email)) return "Invalid email";

  if (taxId.trim().length < 3) return "Invalid tax ID";

  if (website && !isValidWebsite(website)) {
    return "Invalid website";
  }

  if (missionStatement.length > 1000) {
    return "Mission statement too long";
  }

  // 🔹 Token
  const token = goalToken.toUpperCase();

  const limits = {
    ETH: { min: 0.001, max: 1000, decimals: 6 },
    USDC: { min: 1, max: 1000000, decimals: 2 },
    USDT: { min: 1, max: 1000000, decimals: 2 },
    DAI: { min: 1, max: 1000000, decimals: 2 },
  };

  const config = limits[token];
  if (!config) return "Invalid token";

  const amount = Number(goalAmount);
  if (isNaN(amount) || amount <= 0) return "Invalid amount";

  const decimalPart = goalAmount.toString().split(".")[1] || "";
  if (decimalPart.length > config.decimals) {
    return `${token} supports up to ${config.decimals} decimals`;
  }

  if (amount < config.min || amount > config.max) {
    return `Goal must be between ${config.min} and ${config.max}`;
  }

  if (status && !["draft", "active", "paused"].includes(status)) {
    return "Invalid status";
  }

  // 🔥 MEDIA

  if (profileImage && !isValidMediaObject(profileImage)) {
    return "Invalid profile image";
  }

  if (imageUrl.length > 5) return "Max 5 images";

  if (imageUrl.some((img) => !isValidMediaObject(img))) {
    return "Invalid campaign images";
  }

  if (documents.length > 5) return "Max 5 documents";

  if (
    documents.some(
      (doc) =>
        !doc ||
        typeof doc.name !== "string" ||
        typeof doc.url !== "string" ||
        !isValidUrl(doc.url),
    )
  ) {
    return "Invalid documents";
  }

  return null;
};

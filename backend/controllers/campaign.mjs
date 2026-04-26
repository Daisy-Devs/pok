import { Campaign, DonationRecord, Organization } from '../models/index.mjs';
import { v4 as uuidv4 } from 'uuid';
import { sendResponse } from '../utils/response.mjs';
import { campaignQueue } from "../queues/campaignQueue.mjs";
import { ethers } from "ethers";

export const createOrgAndCampaign = async (req, res) => {
  try {
    const walletAddress = req.walletAddress;
    let body = req.body;

    console.log("📥 RAW BODY:", body);

    // 🔹 Helper: strict JSON parser
    const parseIfNeeded = (field, fieldName) => {
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          console.log(`✅ Parsed ${fieldName}:`, parsed);
          return parsed;
        } catch (err) {
          console.error(`❌ Failed parsing ${fieldName}:`, field);
          throw new Error(`Invalid JSON format for ${fieldName}`);
        }
      }
      return field;
    };

    // 🔹 Handle form-data string issues
    body.documents = parseIfNeeded(body.documents, "documents");
    body.imageUrl = parseIfNeeded(body.imageUrl, "imageUrl");
    body.profileImage = parseIfNeeded(body.profileImage, "profileImage");

    console.log("🧾 PROCESSED BODY:", body);

    // 🔹 Validate
    const error = validateCampaignInput(body);
    if (error) {
      console.warn("⚠️ Validation error:", error);
      return sendResponse(res, 400, error);
    }

    // 🔹 Destructure
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
      status
    } = body;

    const normalizedToken = goalToken.toUpperCase();

    // 🔹 Find or create organization
    let organization = await Organization.findOne({ walletAddress });

    if (organization && organization.isProfileComplete) {
      return sendResponse(res, 400, "Organization already exists for this wallet");
    }

    if (!organization) {
      organization = new Organization({ walletAddress });
    }

    // 🔹 Safe assignment
    organization.name = organizationName?.trim();
    organization.taxId = taxId?.trim();
    organization.email = email?.trim();
    organization.country = country;
    organization.website = website;
    organization.profileImage = profileImage || {};
    organization.documents = Array.isArray(documents) ? documents : [];
    organization.isProfileComplete = true;

    console.log("🏢 Organization before save:", organization);

    await organization.save();

    console.log("✅ Organization saved");

    // 🔹 Create campaign ID
    const campaignId = `campaign-${uuidv4()}`;
    const campaignIdBytes32 = ethers.id(campaignId);

    // 🔹 Create campaign
    const campaign = await Campaign.create({
      id: campaignId,
      campaignIdBytes32,
      organization: organization._id,
      title,
      missionStatement,
      cause,
      imageUrl: Array.isArray(imageUrl) ? imageUrl : [],
      goalAmount,
      goalToken: normalizedToken,
      status: status || "draft",
      onChainStatus: "pending"
    });

    console.log("🎯 Campaign created:", campaign);

    // 🔹 Queue blockchain job
    await campaignQueue.addJob({
      campaignIdBytes32,
      ngoWallet: walletAddress
    });

    console.log("📦 Job added to queue:", campaignIdBytes32);

    // 🔹 Final response
    return sendResponse(res, 201, "Campaign created successfully", {
      organization,
      campaign
    });

  } catch (error) {
    console.error("❌ FINAL ERROR:", error);
    return sendResponse(res, 500, error.message);
  }
};

export const createCampaign = async (req, res) => {
  try {
    const ngoId = req.ngoId;
    const walletAddress = req.walletAddress;
    const { title, missionStatement, cause, imageUrl, goalAmount, status } = req.body;

    const organization = await Organization.findById(ngoId);

    if (!organization) {
      return sendResponse(res, 404, "Organization not found");
    }

    if ( organization.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return sendResponse(res, 403, "Unauthorized NGO");
    }

    const campaign = new Campaign({
      id: `campaign-${uuidv4()}`,
      organization: organization._id,
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      status: status || 'draft'
    });

    await campaign.save();

    return sendResponse(res, 201, 'Campaign created successfully', campaign);

  } catch (error) {
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
      status
    } = req.body;

    const campaign = await Campaign.findOne({
      id,
      organization: ngoId
    });

    if (!campaign) {
      return sendResponse(res, 404, 'Campaign not found');
    }

    // ❌ Restriction: Only draft can be updated
    if (campaign.status !== 'draft') {
      return sendResponse(res, 400, 'Only draft campaigns can be updated');
    }

    // ✅ Update allowed fields
    if (title) campaign.title = title;
    if (missionStatement) campaign.missionStatement = missionStatement;
    if (cause) campaign.cause = cause;
    if (imageUrl) campaign.imageUrl = imageUrl;
    if (goalAmount) campaign.goalAmount = goalAmount;

    // ✅ Allow changing status (draft → active)
    if (status) campaign.status = status;

    await campaign.save();

    return sendResponse(res, 200, 'campaigns updated successfully', campaign)

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
      limitPerCause = 6
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    limitPerCause = parseInt(limitPerCause);

    if (page < 1) page = 1;

    // =========================================================
    // ✅ Common Filter
    // =========================================================
    const filter = {
      status: { $in: ["active", "draft"] }
    };

    if (status) filter.status = status;
    if (cause) filter.cause = cause;
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
        { tags: { $elemMatch: { $regex: search, $options: "i" } } }
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

      const campaignIds = campaigns.map(c => c._id || c.id);

      const stats = await DonationRecord.aggregate([
        {
          $match: { campaignId: { $in: campaignIds } }
        },
        {
          $group: {
            _id: "$campaignId",
            totalAmount: { $sum: { $toDouble: "$amount" } }
          }
        }
      ]);

      const statsMap = {};
      stats.forEach(item => {
        statsMap[item._id] = item.totalAmount;
      });

      return campaigns.map(campaign => {
        const totalRaised = statsMap[campaign._id] || 0;
        const goal = Number(campaign.goalAmount);

        return {
          ...campaign.toObject(),
          totalRaised,
          isGoalReached: totalRaised >= goal
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
            campaigns: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            cause: "$_id",
            campaigns: { $slice: ["$campaigns", limitPerCause] }
          }
        },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ];

      const groupedData = await Campaign.aggregate(pipeline);

      // populate organization
      const populated = await Campaign.populate(groupedData, {
        path: "campaigns.organization",
        select: "name email walletAddress profileImage"
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
            _id: { $toLower: { $ifNull: ["$cause", "Others"] } }
          }
        },
        { $count: "total" }
      ]);

      const totalCauses = totalCausesAgg[0]?.total || 0;

      return sendResponse(res, 200, "Grouped campaigns fetched", {
        page,
        totalPages: Math.ceil(totalCauses / limit),
        totalCauses,
        count: populated.length,
        causes: populated
      });
    }

    // =========================================================
    // 🔥 MODE 2: LIST
    // =========================================================
    const total = await Campaign.countDocuments(filter);

    const campaigns = await Campaign.find(filter)
      .select("-_id -__v")
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
      campaigns: updatedCampaigns
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return sendResponse(res, 500, error.message);
  }
};

export const getCampaignsByOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Fetch campaigns
    const campaigns = await Campaign.find({ organization: id })
      .select('-__v')
      .populate(
        'organization',
        'name email walletAddress website profileImage documents'
      )
      .sort({ createdAt: -1 });

    if (!campaigns.length) {
      return sendResponse(res, 404, 'No campaigns found for this organization');
    }

    // 2️⃣ Extract campaign IDs
    const campaignIds = campaigns.map(c => c.id);

    // 3️⃣ Aggregate donors + total raised
    const stats = await DonationRecord.aggregate([
      {
        $match: {
          campaignId: { $in: campaignIds }
        }
      },
      {
        $group: {
          _id: "$campaignId",
          uniqueDonors: { $addToSet: "$donor" },
          totalAmount: {
            $sum: { $toDouble: "$amount" } // 🔥 convert string → number
          }
        }
      },
      {
        $project: {
          _id: 1,
          totalDonors: { $size: "$uniqueDonors" },
          totalRaised: "$totalAmount"
        }
      }
    ]);

    // 4️⃣ Convert to map
    const statsMap = {};
    stats.forEach(item => {
      statsMap[item._id] = {
        totalDonors: item.totalDonors,
        totalRaised: item.totalRaised
      };
    });

    // 5️⃣ Attach stats to campaigns
    const updatedCampaigns = campaigns.map(campaign => {
      const stat = statsMap[campaign.id] || {
        totalDonors: 0,
        totalRaised: 0
      };

      const goal = Number(campaign.goalAmount);

      const progressPercent =
        goal > 0
          ? Number(((stat.totalRaised / goal) * 100).toFixed(2))
          : 0;

      return {
        ...campaign.toObject(),
        totalDonors: stat.totalDonors,
        totalRaised: stat.totalRaised,
        progressPercent,
        isGoalReached: stat.totalRaised >= goal
      };
    });

    // 6️⃣ Response
    return sendResponse(res, 200, 'campaigns fetched successfully', {
      count: updatedCampaigns.length,
      campaigns: updatedCampaigns
    });

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
    status
  } = body;

  // 🔹 Helpers
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidUrl = (url) =>
    typeof url === "string" &&
    url.startsWith("https://res.cloudinary.com/");

  const isValidWebsite = (url) =>
    typeof url === "string" &&
    url.startsWith("https://");

  const isValidMediaObject = (obj) =>
    obj &&
    typeof obj === "object" &&
    typeof obj.url === "string" &&
    isValidUrl(obj.url);

  // 🔹 Trim inputs
  const orgName = organizationName?.trim();
  const mail = email?.trim();
  const tax = taxId?.trim();

  // 🔹 Required fields
  if (!orgName || !tax || !mail || !country) {
    return "Name, Tax Id, email, and country are required";
  }

  if (!title || !missionStatement || !cause || !goalAmount || !goalToken) {
    return "All campaign fields are required";
  }

  // 🔹 Email validation
  if (!isValidEmail(mail)) {
    return "Invalid email format";
  }

  // 🔹 Tax ID validation
  if (typeof tax !== "string" || tax.length < 3) {
    return "Invalid tax ID";
  }

  // 🔹 Website validation
  if (website && !isValidWebsite(website)) {
    return "Invalid website URL";
  }

  // 🔹 Mission statement length
  if (typeof missionStatement !== "string" || missionStatement.length > 1000) {
    return "Mission statement must be ≤ 1000 characters";
  }

  // 🔹 Token validation
  const token = goalToken.toUpperCase();

  const limits = {
    ETH: { min: 0.001, max: 1000, decimals: 6 },
    USDC: { min: 1, max: 1000000, decimals: 2 },
    USDT: { min: 1, max: 1000000, decimals: 2 },
    DAI: { min: 1, max: 1000000, decimals: 2 }
  };

  const config = limits[token];

  if (!config) {
    return "Invalid token selected";
  }

  // 🔹 Amount validation
  const amountStr = goalAmount.toString();
  const amount = Number(amountStr);

  if (isNaN(amount) || amount <= 0) {
    return "Invalid goal amount";
  }

  const decimalPart = amountStr.split(".")[1] || "";
  if (decimalPart.length > config.decimals) {
    return `${token} supports up to ${config.decimals} decimal places`;
  }

  if (amount < config.min || amount > config.max) {
    return `Goal for ${token} must be between ${config.min} and ${config.max}`;
  }

  // 🔹 Status validation
  const allowedStatus = ["draft", "active", "paused"];
  if (status && !allowedStatus.includes(status)) {
    return "Invalid status value";
  }

  // =====================================================
  // 🔥 MEDIA VALIDATION (UPDATED)
  // =====================================================

  // 🔹 Profile Image (object)
  if (profileImage) {
    if (!isValidMediaObject(profileImage)) {
      return "Invalid profile image";
    }
  }

  // 🔹 Campaign Images (array of objects)
  if (imageUrl) {
    if (!Array.isArray(imageUrl)) {
      return "imageUrl must be an array";
    }

    if (imageUrl.length > 5) {
      return "Max 5 campaign images allowed";
    }

    if (imageUrl.some((img) => !isValidMediaObject(img))) {
      return "Invalid campaign image data";
    }
  }

  // 🔹 Documents (array of objects)
  if (documents) {
    if (!Array.isArray(documents)) {
      return "documents must be an array";
    }

    if (documents.length > 5) {
      return "Max 5 documents allowed";
    }

    if (
      documents.some(
        (doc) =>
          !doc ||
          typeof doc.name !== "string" ||
          typeof doc.url !== "string" ||
          !isValidUrl(doc.url)
      )
    ) {
      return "Invalid documents";
    }
  }

  return null;
};
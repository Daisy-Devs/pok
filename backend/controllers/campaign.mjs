import { Campaign, Organization } from '../models/index.mjs';
import { v4 as uuidv4 } from 'uuid';
import { sendResponse } from '../utils/response.mjs';
import { campaignQueue } from "../queues/campaignQueue.mjs";
import { ethers } from "ethers";

export const createOrgAndCampaign = async (req, res) => {
  try {
    const walletAddress = req.walletAddress;

    const {
      organizationName,
      email,
      country,
      website,
      profileImageUrl,
      documents,
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      status
    } = req.body;

    // ✅ 1. VALIDATION
    if (!organizationName || !email || !country) {
      return sendResponse(res, 400, "Name, email, and country are required");
    }

    if (!title || !missionStatement || !cause || !goalAmount) {
      return sendResponse(res, 400, "All campaign fields are required");
    }

    // ✅ 2. FIND OR CREATE + UPDATE (clean pattern)
    let organization = await Organization.findOne({ walletAddress });

    if (!organization) {
      organization = new Organization({ walletAddress });
    }

    organization.name = organizationName;
    organization.email = email;
    organization.country = country;
    organization.website = website;
    organization.profileImageUrl = profileImageUrl;
    organization.documents = documents;
    organization.isProfileComplete = true;

    await organization.save();

    // ✅ 3. CREATE CAMPAIGN ID
    const campaignId = `campaign-${uuidv4()}`;
    const campaignIdBytes32 = ethers.id(campaignId);

    // ✅ 4. CREATE CAMPAIGN
    const campaign = await Campaign.create({
      id: campaignId,
      campaignIdBytes32,
      organization: organization._id,
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      status: status || "draft",
      onChainStatus: "pending"
    });

    // ✅ 5. QUEUE BLOCKCHAIN JOB
    await campaignQueue.addJob({
      campaignIdBytes32,
      ngoWallet: walletAddress
    });

    // ✅ 6. RESPONSE
    return sendResponse(res, 201, "Campaign created successfully", {
      organization,
      campaign
    });

  } catch (error) {
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
    const campaigns = await Campaign.find({ status: { $in: ['active','draft'] } })
      .select('-_id -__v') // exclude unnecessary fields
      .populate('organization', 'name email walletAddress profileImageUrl') // ✅ org details
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'campaigns fetched successfully', {
      count: campaigns.length,
      campaigns
    });

  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

export const getCampaignsByOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const campaigns = await Campaign.find({ organization: id })
      .select('-__v')
      .populate('organization', 'name email walletAddress website profileImageUrl documents')
      .sort({ createdAt: -1 });

    if (!campaigns.length) {
      return sendResponse(res, 404, 'No campaigns found for this organization');
    }

    return sendResponse(res, 200, 'campaigns fetched successfully', {
      count: campaigns.length,
      campaigns
    });

  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};
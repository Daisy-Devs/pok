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

    // 1️⃣ FIND OR CREATE ORGANIZATION
    let organization = await Organization.findOne({ email });

    if (!organization) {
      organization = await Organization.create({
        name: organizationName,
        email,
        country,
        website,
        profileImageUrl,
        walletAddress, // trusted from SIWE
        documents
      });
    } else {
      if (organization.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return sendResponse(res, 403, "Wallet does not match registered NGO account");
      }
    }
    // 2️⃣ CREATE CAMPAIGN ID (UUID)
    const campaignId = `campaign-${uuidv4()}`; // ✅ FIXED
    const campaignIdBytes32 = ethers.id(campaignId);

    // 3️⃣ SAVE CAMPAIGN
    const campaign = await Campaign.create({
      id: campaignId,
      campaignIdBytes32,
      organization: organization._id,
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      status: status || "draft"
    });

    // 4️⃣ QUEUE BLOCKCHAIN TASK
    await campaignQueue.addJob({
      campaignId,
      campaignIdBytes32,
      ngoWallet: walletAddress
    });

    return sendResponse(res, 201, 'Campaign created successfully', {
      organization,
      campaign
    });

  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

export const createCampaign = async (req, res) => {
  try {
    const {
      organizationId,
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      status
    } = req.body;

    const campaign = new Campaign({
      id: `campaign-${uuidv4()}`,
      organization: organizationId,
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
    const { id } = req.params;
    const {
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      status
    } = req.body;

    const campaign = await Campaign.findOne({ id });

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
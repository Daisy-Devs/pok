import { Campaign, Organization } from '../models/index.mjs';
import { v4 as uuidv4 } from 'uuid';

export const createOrgAndCampaign = async (req, res) => {
  try {
    const {
      organizationName,
      email,
      country,
      website,
      profileImageUrl,
      walletAddress,
      documents,
      title,
      missionStatement,
      cause,
      imageUrl,
      goalAmount,
      status
    } = req.body;

    let organization = await Organization.findOne({ email });

    if (!organization) {
      organization = new Organization({
        name: organizationName,
        email,
        country,
        website,
        profileImageUrl,
        walletAddress,
        documents
      });

      await organization.save();
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

    // 🔐 Create wallet token
    const walletToken = jwt.sign(
      { walletAddress, organizationId: organization._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 🍪 Set cookie instead of sending token
    res.cookie('walletToken', walletToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'Campaign created successfully',
      organization,
      campaign
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // ❌ Restriction: Only draft can be updated
    if (campaign.status !== 'draft') {
      return res.status(400).json({
        message: 'Only draft campaigns can be updated'
      });
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

    res.status(200).json({
      message: 'Campaign updated successfully',
      campaign
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: { $in: ['active','draft'] } })
      .select('-_id -__v') // exclude unnecessary fields
      .populate('organization', 'name email walletAddress profileImageUrl') // ✅ org details
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: campaigns.length,
      campaigns
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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
      return res.status(404).json({ message: 'No campaigns found for this organization' });
    }

    res.status(200).json({
      count: campaigns.length,
      campaigns
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
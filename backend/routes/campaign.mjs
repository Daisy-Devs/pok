import express from 'express';
import { createCampaign, createOrgAndCampaign, getAllCampaigns, getCampaignsByOrganization, updateCampaign } from '../controllers/campaign.mjs';
import { ngoAuth } from '../middleware/ngoAuth.mjs';

const router = express.Router();

router.post('/orgAndCampaign', ngoAuth, createOrgAndCampaign);
router.post('/create', ngoAuth, createCampaign);
router.post('/:id', ngoAuth, updateCampaign);

router.get('/', getAllCampaigns);
router.get('/:id', getCampaignsByOrganization);


export default router;
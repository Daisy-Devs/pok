import express from 'express';
import { createCampaign, createOrgAndCampaign, getAllCampaigns, getCampaignsByOrganization, updateCampaign } from '../controllers/campaign.mjs';

const router = express.Router();

router.post('/orgAndCampaign', createOrgAndCampaign);
router.post('/create', createCampaign);
router.post('/:id', updateCampaign);
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignsByOrganization);


export default router;
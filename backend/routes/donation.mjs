import express from 'express';
import { getAllDonations, getDonationsByCampaign, getDonationsByDonor } from '../controllers/donationRecord.mjs';
import { getAllWithdrawals, getWithdrawalsByCampaign } from '../controllers/withdrawRecord.mjs';
import { donorAuth } from '../middleware/donorAuth.mjs';
import { ngoAuth } from '../middleware/ngoAuth.mjs';

const router = express.Router();

router.get("/", getAllDonations);
router.get("/:campaignId", getDonationsByCampaign);
router.get("/user", donorAuth, getDonationsByDonor);

router.get("/withdraw", ngoAuth, getAllWithdrawals);
router.get("/withdraw/:campaignId", ngoAuth, getWithdrawalsByCampaign);


export default router;
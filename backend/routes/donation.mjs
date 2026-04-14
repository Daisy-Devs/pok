import express from 'express';
import { getAllDonations, getDonationsByCampaign, getDonationsByDonor } from '../controllers/donationRecord.mjs';
import { getAllWithdrawals, getWithdrawalsByCampaign, getWithdrawalsByNgo } from '../controllers/withdrawRecord.mjs';

const router = express.Router();

router.get("/", getAllDonations);
router.get("/:campaignId", getDonationsByCampaign);
router.get("/user/:wallet", getDonationsByDonor);

router.get("/withdraw", getAllWithdrawals);
router.get("/withdraw/:wallet", getWithdrawalsByNgo);
router.get("/withdraw/:campaignId", getWithdrawalsByCampaign);


export default router;
import express from 'express';
import { getAllDonations, getDonationsByCampaign, getDonationsByDonor, getDonationsByOrg } from '../controllers/donationRecord.mjs';
import { getAllWithdrawals, getNgoBalance, getWithdrawalsByCampaign } from '../controllers/withdrawRecord.mjs';
import { donorAuth } from '../middleware/donorAuth.mjs';
import { ngoAuth } from '../middleware/ngoAuth.mjs';

const router = express.Router();


router.get("/", getAllDonations);
router.get("/user", donorAuth, getDonationsByDonor);
router.get("/org/history", ngoAuth, getDonationsByOrg);

router.get("/withdraw", ngoAuth, getAllWithdrawals);
router.get("/getWithdrawBalance", ngoAuth, getNgoBalance);
router.get("/withdraw/:campaignId", ngoAuth, getWithdrawalsByCampaign);

router.get("/:campaignId", getDonationsByCampaign);

export default router;
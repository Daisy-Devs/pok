import express from 'express';
import campaignRoute from './campaign.mjs';
import userRoute from './user.mjs';
import donationRecordRoute from './donationRecord.mjs';
import walletRoute from './wallet.mjs';

const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.status(200).json('Welcome to the Backend Server');
});

// Routes
router.use('/campaign', campaignRoute);
router.use('/user', userRoute);
router.use('/donationRecord', donationRecordRoute);
router.use('/wallet', walletRoute)

export default router;
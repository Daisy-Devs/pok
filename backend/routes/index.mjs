import express from 'express';
import campaignRoute from './campaign.mjs';
import userRoute from './user.mjs';
import donationRoute from './donation.mjs';
import walletRoute from './wallet.mjs';
import cloudinaryRoute from './cloudinary.mjs';
import { sendResponse } from '../utils/response.mjs';

const router = express.Router();

// Home route
router.get('/', (req, res) => {
  return sendResponse(res, 200, 'Welcome to the Backend Server');
});

// Routes
router.use('/campaign', campaignRoute);
router.use('/user', userRoute);
router.use('/donation', donationRoute);
router.use('/wallet', walletRoute)
router.use('/cloudinary', cloudinaryRoute)

export default router;
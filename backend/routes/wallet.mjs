import express from 'express';
import { connectWallet } from '../controllers/wallet.mjs';

const router = express.Router();

router.post('/connect', connectWallet);


export default router;
import express from 'express';
import { connectWallet, disconnectWallet, loginWithWallet, logoutWallet } from '../controllers/wallet.mjs';
import { donorAuth } from '../middleware/donorAuth.mjs';
import { ngoAuth } from '../middleware/ngoAuth.mjs';

const router = express.Router();

router.post('/connect', donorAuth, connectWallet);
router.post('/disconnect', donorAuth, disconnectWallet);
router.post('/login', loginWithWallet);
router.post('/logout', ngoAuth, logoutWallet);


export default router;
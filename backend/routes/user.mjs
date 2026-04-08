import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  forgotPassword,
  getUsers,
  resetPassword,
  appleAuth,
  logoutUser,
  logoutWallet,
  getCurrentUser
} from '../controllers/user.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword)
router.post('/logout', logoutUser);
router.post('/wallet/logout', logoutWallet);
router.get('/me', getCurrentUser);
router.get('/', getUsers);

export default router;
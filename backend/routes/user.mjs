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
  getCurrentUser
} from '../controllers/user.mjs';
import { donorAuth } from '../middleware/donorAuth.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword)
router.post('/logout', donorAuth, logoutUser);
router.get('/me', donorAuth, getCurrentUser);
router.get('/', getUsers);

export default router;
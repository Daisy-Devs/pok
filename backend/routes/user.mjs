import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  forgotPassword,
  getUsers,
  resetPassword,
  appleAuth
} from '../controllers/user.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword)
router.get('/', getUsers)

export default router;
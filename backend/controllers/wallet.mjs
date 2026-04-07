import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/response.mjs';

export const connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return sendResponse(res, 400, 'Wallet address required');
    }

    const walletToken = jwt.sign(
      { walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 🍪 Set cookie
    res.cookie('walletToken', walletToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return sendResponse(res, 200, 'Wallet connected', walletAddress)

  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};
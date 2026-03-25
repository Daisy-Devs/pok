import jwt from 'jsonwebtoken';

export const connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address required' });
    }

    // 🔐 Create wallet session token (1 day)
    const walletToken = jwt.sign(
      { walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Wallet connected',
      walletToken,
      walletAddress
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
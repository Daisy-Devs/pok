import jwt from 'jsonwebtoken';

export const connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address required' });
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

    res.status(200).json({
      message: 'Wallet connected',
      walletAddress
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
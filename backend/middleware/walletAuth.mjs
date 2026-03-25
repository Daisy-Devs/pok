import jwt from 'jsonwebtoken';

export const walletAuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No wallet token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.wallet = decoded; // contains organizationId + walletAddress
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Wallet session expired or invalid' });
  }
};
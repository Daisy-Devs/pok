import jwt from 'jsonwebtoken';

export const walletAuthMiddleware = (req, res, next) => {
  try {
    let token;

    // ✅ Get from cookie
    if (req.cookies && req.cookies.walletToken) {
      token = req.cookies.walletToken;
    }

    // ✅ Optional fallback (for Postman/testing)
    else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No wallet token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.wallet = decoded; // walletAddress
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Wallet session expired or invalid' });
  }
};
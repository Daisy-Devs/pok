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
      return sendResponse(res, 401, 'No wallet token providedn');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.wallet = decoded; // walletAddress
    next();

  } catch (error) {
    return sendResponse(res, 401, 'Wallet session expired or invalid');
  }
};
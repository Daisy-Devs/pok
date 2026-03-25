import jwt from 'jsonwebtoken';
import { User } from '../models/user.mjs';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // check header format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // optional: check if user still exists
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // attach user info
    req.user = user;
    req.userId = user._id;

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    res.status(401).json({ message: 'Invalid token' });
  }
};
import jwt from 'jsonwebtoken';
import { User } from '../models/user.mjs';
import { sendResponse } from '../utils/response.mjs';

export const donorAuth = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendResponse(res, 401, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ❗ Only allow donor
    if (decoded.role !== "donor") {
      return sendResponse(res, 403, "Only donors allowed");
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return sendResponse(res, 401, "User not found");
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    return sendResponse(res, 401, "Invalid or expired token");
  }
};
import jwt from 'jsonwebtoken';
import { Organization } from "../models/organization.mjs";
import { sendResponse } from '../utils/response.mjs';

export const ngoAuth = async (req, res, next) => {
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

    // ❗ Only allow NGO
    if (decoded.role !== "ngo") {
      return sendResponse(res, 403, "Only NGOs allowed");
    }

    const ngo = await Organization.findById(decoded.ngoId);

    if (!ngo) {
      return sendResponse(res, 401, "NGO not found");
    }

    req.ngo = ngo;
    req.ngoId = ngo._id;
    req.walletAddress = decoded.wallet;

    next();
  } catch (error) {
    return sendResponse(res, 401, "Invalid or expired token");
  }
};
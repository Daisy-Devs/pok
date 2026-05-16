import { sendResponse } from '../utils/response.mjs';
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { User } from "../models/user.mjs";
import { Organization } from "../models/organization.mjs";

export const connectWallet = async (req, res) => {
  try {
    const userId = req.userId;
    let { walletAddress } = req.body;

    if (!walletAddress) {
      return sendResponse(res, 400, "Wallet address required");
    }

    // ✅ Validate wallet format
    if (!ethers.isAddress(walletAddress)) {
      return sendResponse(res, 400, "Invalid wallet address");
    }

    walletAddress = ethers.getAddress(walletAddress).toLowerCase();

    // 🔍 check if wallet already linked to another user
    const existingUser = await User.findOne({ walletAddress });

    if (existingUser && existingUser._id.toString() !== userId) {
      return sendResponse(res, 400, "Wallet already linked to another account");
    }

    // 🔍 get current user
    const user = await User.findById(userId);

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    // ✅ if already same wallet
    if (user.walletAddress === walletAddress) {
      return sendResponse(res, 200, "Wallet already connected", user);
    }

    // ✅ update wallet
    user.walletAddress = walletAddress;
    await user.save();

    return sendResponse(res, 200, "Wallet connected successfully", user);

  } catch (error) {
    console.error("Connect Wallet Error:", error);
    return sendResponse(res, 500, error.message);
  }
};

export const disconnectWallet = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user.walletAddress) {
      return sendResponse(res, 400, "No wallet connected");
    }

    // ❌ remove wallet
    user.walletAddress = null;
    await user.save();

    return sendResponse(res, 200, "Wallet disconnected successfully", user);

  } catch (error) {
    console.error("Disconnect Wallet Error:", error);
    return sendResponse(res, 500, error.message);
  }
};

export const loginWithWalletV1 = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return sendResponse(res, 400, "Wallet address required");
    }

    // 🔥 DEV MODE: skip signature check
    if (process.env.NODE_ENV !== "production") {
      console.log("⚠️ DEV MODE: Skipping signature verification");
    } else {
      // ✅ PRODUCTION (keep your original logic)
      const { signature, message } = req.body;

      const recovered = ethers.verifyMessage(message, signature);

      if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
        return sendResponse(res, 401, "Invalid signature");
      }
    }

    // 2️⃣ Find or create NGO
    let ngo = await Organization.findOne({ walletAddress });

    if (!ngo) {
      ngo = await Organization.create({ walletAddress });
    }

    // 3️⃣ Create JWT
    const token = jwt.sign(
      {
        ngoId: ngo._id,
        wallet: walletAddress
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4️⃣ Cookie
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    return sendResponse(res, 200, "Login successful", ngo);

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const loginWithWallet = async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress) {
      return sendResponse(res, 400, "Missing walletAddress");
    }

    if (!signature) {
      return sendResponse(res, 400, "Missing signature");
    }

    if (!message) {
      return sendResponse(res, 400, "Missing message");
    }
    // 1. Verify signature
    const recovered = ethers.verifyMessage(message, signature);

    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      return sendResponse(res, 401, 'Invalid signature');    
    }

    // 2. Find or create NGO
    let ngo = await Organization.findOne({ walletAddress });

    if (!ngo) {
      ngo = await Organization.create({ walletAddress });
    }

    // 3. Create JWT (1 day expiry)
    const token = jwt.sign(
      {
        ngoId: ngo._id,
        role: "ngo",
        wallet: walletAddress
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Set cookie
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    return sendResponse(res, 200, "Login successful", { ngo, role: "ngo" });

  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};

export const logoutWallet = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: "none"
  });
  return sendResponse(res, 200, 'Logged out successfully');
};
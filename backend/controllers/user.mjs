import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import appleSignin from 'apple-signin-auth';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.mjs';
import { sendResponse } from '../utils/response.mjs';
import { sendEmail } from '../utils/sendEmail.mjs';
import { DonationRecord } from '../models/donationRecord.mjs';
import { Campaign } from '../models/campaign.mjs';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, 'Email and password are required');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

    if (!passwordRegex.test(password)) {
      return sendResponse(res, 400, 'Password must be 8-15 chars, include uppercase, lowercase, number, and special character');
    }

    let user = await User.findOne({ email });

    if (user) {
      // If user exists but no manual login yet → allow adding password
      if (!user.password) {
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        if (!user.providers.includes('manual')) {
          user.providers.push('manual');
        }

        await user.save();
      } else {
        return sendResponse(res, 400, 'User already exists');
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        providers: ['manual']
      });

      await user.save();
    }

    // 🔐 Create JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: "donor" 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🍪 Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // 👉 set true in production (HTTPS)
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const userObj = user.toObject();
    delete userObj.password;

    return sendResponse(res, 201, 'User registered successfully', {userObj, role: "donor"});

  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return sendResponse(res, 400, 'No Google token provided');
    }

    // 🔐 Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, name, email, email_verified } = payload;

    if (!email_verified) {
      return sendResponse(res, 400, 'Google email not verified');
    }

    // ✅ Find user by googleId OR email
    let user = await User.findOne({
      $or: [{ googleId: sub }, { email }]
    });

    // 🆕 Create new user
    if (!user) {
      user = new User({
        name,
        email,
        googleId: sub,
        providers: ['google']
      });

      await user.save();
    } 
    // 🔄 Existing user (merge accounts)
    else {
      let updated = false;

      if (!user.googleId) {
        user.googleId = sub;
        updated = true;
      }

      if (!user.providers.includes('google')) {
        user.providers.push('google');
        updated = true;
      }

      if (updated) await user.save();
    }

    // 🔐 Create JWT
    const jwtToken = jwt.sign(
      { userId: user._id,
        role: "donor"
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🍪 Set cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: false, // 👉 true in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = user.toObject();
    delete userObj.password;

    return sendResponse(res, 200, 'Google login successful', userObj);

  } catch (error) {
    console.error(error);
    return sendResponse(res, 401, 'Invalid Google token');
  }
};

export const appleAuth = async (req, res) => {
  try {
    const { identityToken } = req.body;

    if (!identityToken) {
      return sendResponse(res, 400, 'No Apple token provided');
    }

    // 🔐 Verify Apple token
    const appleUser = await appleSignin.verifyIdToken(identityToken, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: false,
    });

    const { email, sub } = appleUser; // sub = Apple unique ID

    // ✅ Find user by appleId OR email
    let user = await User.findOne({
      $or: [{ appleId: sub }, { email }]
    });

    // 🆕 Create new user
    if (!user) {
      user = new User({
        name: 'Apple User',
        email: email || null,
        appleId: sub,
        providers: ['apple']
      });

      await user.save();
    } 
    // 🔄 Existing user (merge accounts)
    else {
      let updated = false;

      if (!user.appleId) {
        user.appleId = sub;
        updated = true;
      }

      if (!user.providers.includes('apple')) {
        user.providers.push('apple');
        updated = true;
      }

      if (updated) await user.save();
    }

    // 🔐 Create JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        role: "donor"
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🍪 Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // 👉 true in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = user.toObject();
    delete userObj.password;

    return sendResponse(res, 200, 'Apple Login successful', {userObj, role: "donor"});

  } catch (error) {
    console.error(error);
    return sendResponse(res, 401, 'Invalid Apple token');
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, 'Email and password are required');
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return sendResponse(res, 400, 'Invalid credentials or use social login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendResponse(res, 400, 'Invalid credentials');
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        role: "donor"
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,        // true in production (HTTPS)
      sameSite: 'none',    // needed for frontend (especially Google login)
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = user.toObject();
    delete userObj.password;

    return sendResponse(res, 200, 'Login successful', {userObj, role: "donor"});

  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, 'Email is required');
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 400, 'User not found');
    }

    // ❌ Block Google-only users
    if (!user.password) {
      return sendResponse(
        res,
        400,
        'This account uses Google login. Please login with Google.'
      );
    }

    // 🔐 Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 🔐 Hash token before saving
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    // 🔗 Create reset URL
    const resetURL = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    // 📧 Send email
    await sendEmail(
      user.email,
      'Password Reset',
      `Reset your password using this link (valid for 15 minutes): ${resetURL}`
    );

    console.log('Reset URL:', resetURL);

    return sendResponse(res, 200, 'Password reset link sent to email');

  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return sendResponse(res, 400, 'Password is required');
    }

    // 🔐 Password validation (strong password)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,15}$/;

    if (!passwordRegex.test(password)) {
      return sendResponse(
        res,
        400,
        'Password must be 8-15 chars, include uppercase, lowercase, number, and special character'
      );
    }

    // 🔐 Hash incoming token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 🔍 Find user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return sendResponse(res, 400, 'Invalid or expired token');
    }

    // 🔐 Set new password
    user.password = await bcrypt.hash(password, 10);

    // 🧹 Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // 🔄 Ensure manual login exists
    if (!user.providers.includes('manual')) {
      user.providers.push('manual');
    }

    await user.save();

    return sendResponse(res, 200, 'Password reset successful');

  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false // 👉 true in production
  });

  return sendResponse(res, 200, 'User logged out successfully');
};

export const getCurrentUser = async (req, res) => {
  try {
    return sendResponse(res, 200, 'User fetched', req.user);
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // ✅ 1. Get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ 2. STATS using aggregation (efficient)
    const statsAgg = await DonationRecord.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalAmountDonated: {
            $sum: { $toDouble: "$amount" }
          },
          campaigns: { $addToSet: "$campaignId" }
        }
      }
    ]);

    const totalAmountDonated = statsAgg[0]?.totalAmountDonated || 0;
    const causesSupported = statsAgg[0]?.campaigns?.length || 0;

    // ✅ 3. PAGINATED donations
    const donations = await DonationRecord.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // ✅ 4. Get campaign names
    const campaignIds = [
      ...new Set(donations.map(d => d.campaignId))
    ];

    const campaigns = await Campaign.find({
      id: { $in: campaignIds }
    });

    const campaignMap = {};
    campaigns.forEach(c => {
      campaignMap[c.id] = c.title;
    });

    // ✅ 5. Format recent impact
    const recentImpact = donations.map(d => ({
      campaignId: d.campaignId,
      campaignName: campaignMap[d.campaignId] || "Unknown",
      amount: d.amount,
      date: d.createdAt,
      transactionHash: d.transactionHash
    }));

    // ✅ 6. Total count for pagination
    const totalRecords = await DonationRecord.countDocuments({ userId });

    return res.status(200).json({
      profile: {
        name: user.name,
        walletAddress: user.walletAddress,
        profileImage: user.profileImage?.url || null,
        memberSince: user.createdAt
      },
      stats: {
        totalAmountDonated,
        causesSupported
      },
      recentImpact,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpires -__v')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Users fetched successfully', {
      count: users.length,
      users
    });

  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};
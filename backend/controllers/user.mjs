import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import appleSignin from 'apple-signin-auth';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.mjs';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be 8-15 chars, include uppercase, lowercase, number, and special character'
      });
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
        return res.status(400).json({ message: 'User already exists' });
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
      { userId: user._id },
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

    // ❌ No need to send token in response
    res.status(201).json({
      message: 'User registered successfully',
      user: userObj
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'No Google token provided' });
    }

    // 🔐 Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, name, email, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ message: 'Google email not verified' });
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
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🍪 Set cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: false, // 👉 true in production (HTTPS)
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: 'Google login successful',
      user: userObj
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

export const googleAuthV1 = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token
      // ❌ removed audience check
    });

    const payload = ticket.getPayload();

    console.log("Google Payload:", payload); // debug

    const { name, email, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ message: 'Google email not verified' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        providers: ['google']
      });

      await user.save();
    } else {
      if (!user.providers.includes('google')) {
        user.providers.push('google');
        await user.save();
      }
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ token: jwtToken, user: userObj });

  } catch (error) {
    console.log(error); // 👈 VERY IMPORTANT
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(400).json({
        message: 'Invalid credentials or use social login'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
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

    res.status(200).json({
      message: 'Login successful',
      user: userObj
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const appleAuth = async (req, res) => {
  try {
    const { identityToken } = req.body;

    if (!identityToken) {
      return res.status(400).json({ message: 'No Apple token provided' });
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
      { userId: user._id },
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

    res.status(200).json({
      message: 'Apple login successful',
      user: userObj
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid Apple token' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ IMPORTANT CONDITION (your doubt)
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google login. Please login with Google."
      });
    }

    // generate raw token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // hash token (store only hashed)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // TODO: Send email here
    console.log("Reset URL:", resetURL);

    res.status(200).json({
      message: "Password reset link sent to email"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // hash incoming token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    // set new password
    user.password = await bcrypt.hash(password, 10);

    // clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // ensure manual login is enabled
    if (!user.providers.includes('manual')) {
      user.providers.push('manual');
    }

    await user.save();

    res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpires -__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    profileImage: { url: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String }, // not required for social login
    phone: { type: String },
    walletAddress: {type: String},
    googleId: { type: String, unique: true, sparse: true },
    appleId: { type: String, unique: true, sparse: true },
    providers: {
      type: [String],
      enum: ['manual', 'google', 'apple'],
      default: ['manual']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
    },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', UserSchema);
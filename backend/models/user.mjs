import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // not required for social login
    phone: { type: String },
    providers: {
      type: [String],
      enum: ['manual', 'google', 'apple', 'facebook'],
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
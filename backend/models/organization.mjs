import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String },
    taxId: { type: String, trim: true },
    email: { type: String, unique: true, sparse: true },
    country: { type: String },
    website: { type: String },
    profileImageUrl: { type: String },
    walletAddress: { type: String, required: true, unique: true },
    documents: [
      {
        name: String,
        url: String
      }
    ],
    isProfileComplete: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Organization = mongoose.model('Organization', OrganizationSchema);
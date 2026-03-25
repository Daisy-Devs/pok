import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    website: { type: String },
    profileImageUrl: { type: String },
    walletAddress: { type: String, required: true },
    documents: [
      {
        name: String,
        url: String
      }
    ]
  },
  { timestamps: true }
);

export const Organization = mongoose.model('Organization', OrganizationSchema);
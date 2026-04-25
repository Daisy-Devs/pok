import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String },
    taxId: { type: String, trim: true },
    email: { type: String, unique: true, sparse: true },
    country: { type: String },
    website: { type: String },
    profileImage: {
      url: String,
      public_id: String
    },
    walletAddress: { type: String, required: true, unique: true },
    documents: [
      {
        name: String,
        url: String,
        public_id: String,
        type: String
      }
    ],
    isProfileComplete: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Organization = mongoose.model('Organization', OrganizationSchema);
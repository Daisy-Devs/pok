import mongoose from 'mongoose';

const DonationRecordSchema = new mongoose.Schema(
  {
    donor: { type: String, required: true }, // wallet address of donor
    campaignId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    transactionHash: { type: String, required: true, unique: true },
    privacy: { type: String, enum: ['public', 'anonymous'] }
  },
  {
    timestamps: true
  }
);

export const DonationRecord = mongoose.model('DonationRecord', DonationRecordSchema);
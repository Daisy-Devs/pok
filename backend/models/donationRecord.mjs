import mongoose from "mongoose";

const DonationRecordSchema = new mongoose.Schema(
  {
    donor: { type: String, required: true }, // normalized wallet
    campaignId: { type: String, required: true }, // decoded from bytes32
    ngoWallet: { type: String, required: true }, // normalized wallet
    amount: { type: String, required: true }, // formatted (for display)
    token: { type: String, required: true }, // address(0) or ERC20
    isAnonymous: { type: Boolean, default: false },
    donorName: { type: String, default: "Anonymous" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

DonationRecordSchema.index({ donor: 1 });
DonationRecordSchema.index({ campaignId: 1 });

export const DonationRecord = mongoose.model("DonationRecord", DonationRecordSchema);
import mongoose from "mongoose";

const DonationRecordSchema = new mongoose.Schema(
  {
    donor: { type: String, required: true }, // normalized wallet
    campaignId: { type: String, index: true, required: true }, // readable
    campaignIdBytes32: { type: String, required: true }, // blockchain
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
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

export const DonationRecord = mongoose.model("DonationRecord", DonationRecordSchema);
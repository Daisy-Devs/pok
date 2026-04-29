import mongoose from "mongoose";

const WithdrawRecordSchema = new mongoose.Schema(
  {
    campaignId: { type: String, required: true },
    ngoWallet: { type: String, required: true }, // campaignOwner
    amount: { type: String, required: true },
    token: { type: String, required: true },
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


export const WithdrawRecord = mongoose.model("WithdrawRecord", WithdrawRecordSchema);
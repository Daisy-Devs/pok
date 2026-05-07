import { DonationRecord } from "../models/donationRecord.mjs";
import { WithdrawRecord } from "../models/withdrawRecord.mjs";

export const saveDonation = async (data) => {
  try {
    const { txHash, status } = data;

    const existing = await DonationRecord.findOne({ transactionHash: txHash });

    const result = await DonationRecord.findOneAndUpdate(
      { transactionHash: txHash },
      {
        $setOnInsert: {        // only on NEW document
          ...data,
          transactionHash: txHash
        },
        $set: {                // always update status smartly
          status: existing?.status === "success" ? "success" : status
        }
      },
      { upsert: true, new: true }
    );

    console.log("✅ Donation saved/updated:", txHash, result.status);
    return result;

  } catch (err) {
    if (err.code === 11000) {
      console.log("⚠️ Duplicate donation silently ignored:", txHash);
      return;
    }
    console.error("❌ Error saving donation:", err.message);
    throw err;
  }
};

export const saveWithdraw = async (data) => {
  try {
    const { txHash } = data;

    // 🔒 prevent duplicates
    const existing = await WithdrawRecord.findOne({
      transactionHash: txHash
    });

    if (existing) {
      console.log("⚠️ Duplicate withdraw skipped:", txHash);
      return;
    }

    const withdraw = await WithdrawRecord.create({
      ...data,
      transactionHash: txHash
    });

    console.log("✅ Withdraw saved:", txHash);

    return withdraw;

  } catch (err) {
    console.error("❌ Error saving withdraw:", err.message);
    throw err;
  }
};
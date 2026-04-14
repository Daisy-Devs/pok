import { DonationRecord } from "../models/donationRecord.mjs";
import { WithdrawRecord } from "../models/withdrawRecord.mjs";

export const saveDonation = async (data) => {
  try {
    const { txHash } = data;

    // 🔒 Prevent duplicates
    const existing = await DonationRecord.findOne({
      transactionHash: txHash
    });

    if (existing) {
      console.log("⚠️ Duplicate donation skipped:", txHash);
      return;
    }

    // ✅ Save
    const donation = await DonationRecord.create({
      ...data,
      transactionHash: txHash
    });

    console.log("✅ Donation saved:", txHash);

    return donation;

  } catch (err) {
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
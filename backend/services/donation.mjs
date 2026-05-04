import { DonationRecord } from "../models/donationRecord.mjs";
import { WithdrawRecord } from "../models/withdrawRecord.mjs";

export const saveDonation = async (data) => {
  try {
    const { txHash, status } = data;

    // 🔍 Check if already exists
    const existing = await DonationRecord.findOne({
      transactionHash: txHash
    });

    // 🔁 If exists → update status safely
    if (existing) {
      console.log("⚠️ Existing donation found:", txHash);

      // ✅ If success comes → always override
      if (status === "success") {
        existing.status = "success";
      }
      // ❌ Don't override success with failed
      else if (existing.status !== "success") {
        existing.status = status;
      }

      await existing.save();

      console.log("✅ Donation updated:", existing.status);
      return existing;
    }

    // 🆕 If new → create
    const donation = await DonationRecord.create({
      ...data,
      transactionHash: txHash
    });

    console.log("✅ Donation saved:", txHash, status);

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
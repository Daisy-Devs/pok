// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { User, Organization, Campaign } from "../models/index.mjs";

// dotenv.config({ path: "../.env" }); // 🔥 FIX

// console.log("MONGO_URI:", process.env.MONGO_URI); // debug

// await mongoose.connect(process.env.MONGO_URI);

// await User.deleteMany({});
// await Organization.deleteMany({});
// await Campaign.deleteMany({});

// console.log("DB cleared");
// process.exit();


import mongoose from "mongoose";
import dotenv from "dotenv";
import { DonationRecord } from "../models/index.mjs";

dotenv.config({ path: "../.env" });

async function run() {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    await DonationRecord.collection.dropIndex("campaignId_1");

    console.log("✅ campaignId_1 index dropped");
  } catch (err) {
    console.log("⚠️ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

run();
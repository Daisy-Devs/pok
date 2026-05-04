// import mongoose from "mongoose";
// import dotenv from "dotenv";
//import { User, Organization, Campaign } from "../models/index.mjs";

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
import {Campaign} from "../models/campaign.mjs"; // ✅ adjust path if needed

dotenv.config({ path: "../.env" });

async function run() {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    // ✅ Convert string → ObjectId
    const campaignId = "0xc5cae79b7f03dde3e4c8f7830696613d448337b8ddb899a367a404e59e474311";

    // ✅ Update campaign
    const result = await Campaign.updateOne(
      { campaignIdBytes32: campaignId },
      {
        $set: {
          status: "completed",
          completedAt: new Date() // optional but recommended
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log("⚠️ No campaign found with this ID");
    } else if (result.modifiedCount === 0) {
      console.log("ℹ️ Campaign already updated");
    } else {
      console.log("✅ Campaign status updated successfully");
    }

  } catch (err) {
    console.log("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
    process.exit();
  }
}

run();
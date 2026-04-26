import mongoose from "mongoose";
import dotenv from "dotenv";
import { User, Organization, Campaign } from "../models/index.mjs";

dotenv.config({ path: "../.env" }); // 🔥 FIX

console.log("MONGO_URI:", process.env.MONGO_URI); // debug

await mongoose.connect(process.env.MONGO_URI);

await User.deleteMany({});
await Organization.deleteMany({});
await Campaign.deleteMany({});

console.log("DB cleared");
process.exit();
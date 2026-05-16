import dotenv from "dotenv";
dotenv.config(); // ✅ runs first

import("./index.mjs").catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
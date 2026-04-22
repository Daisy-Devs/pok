import { redis } from "../utils/redis.mjs";

const QUEUE_KEY = "campaignQueue";

export const campaignQueue = {
  addJob: async (data) => {
    try {
      // ✅ Always store as JSON string
      await redis.lpush(QUEUE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("❌ Error adding job to queue:", err.message);
    }
  },

  getJob: async () => {
    try {
      const job = await redis.lpop(QUEUE_KEY);

      console.log("🔍 Redis raw job:", job);
      console.log("🔍 Type:", typeof job);

      if (!job) return null;

      // ✅ Safe parsing (handles bad/old data)
      if (typeof job === "string") {
        try {
          return JSON.parse(job);
        } catch (err) {
          console.error("❌ Invalid JSON in Redis, skipping:", job);
          return null;
        }
      }

      // ✅ If already object (edge case)
      return job;

    } catch (err) {
      console.error("❌ Error getting job from queue:", err.message);
      return null;
    }
  }
};
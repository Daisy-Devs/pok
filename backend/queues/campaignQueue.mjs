import { redis } from "../utils/redis.mjs";

const QUEUE_KEY = "campaignQueue";

export const campaignQueue = {
  addJob: async (data) => {
    await redis.lpush(QUEUE_KEY, JSON.stringify(data));
  },

  getJob: async () => {
    const job = await redis.lpop(QUEUE_KEY);
    console.log("🔍 Redis job:", job);
    return job ? JSON.parse(job) : null;
  }
};
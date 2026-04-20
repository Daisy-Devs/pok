import { redis } from "../utils/redis.mjs";

const QUEUE_KEY = "campaignQueue";

export const campaignQueue = {
  addJob: async (data) => {
    await redis.lpush(QUEUE_KEY, JSON.stringify(data));
  },

  getJob: async () => {
    const job = await redis.rpop(QUEUE_KEY);
    return job ? JSON.parse(job) : null;
  }
};
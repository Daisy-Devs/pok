import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.mjs';

import { startAllListeners } from "./services/index.mjs";
import { startWorker } from "./queueConsume/campaignQueueConsume.mjs";
import { redis } from './utils/redis.mjs';

const app = express();

// ✅ CORS
app.use(cors({
  origin: 'https://pok-frontend-production.up.railway.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/', routes);

// ✅ MongoDB connection + start listeners
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    startAllListeners();
    startWorker();

    // ✅ TEMP - clear Redis
    // await redis.flushall()
    // console.log("🔥 Redis cleared");

  })
  .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
  res.send('Private donation backend running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
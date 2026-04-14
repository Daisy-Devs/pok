import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.mjs';

import { startAllListeners } from "./services/index.mjs";
import { startWorker } from "./queueConsume/campaignQueueConsume.mjs";

const app = express();

// ✅ CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/', routes);

// ✅ MongoDB connection + start listeners
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    // 🔥 START LISTENERS HERE
    startAllListeners();

    startWorker();

  })
  .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
  res.send('Private donation backend running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
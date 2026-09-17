import express from 'express';
import cors from 'cors';

import userRoute from './routes/userRoutes.js';
import { logger } from './middlewares/logger.js';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(logger);
app.use('/api', userRoute);

export default app;

import express from 'express';
import cors from 'cors';
import ViteExpress from "vite-express";

import { referralRoutes } from './routes/referralRoutes';
import fileRoutes from './routes/fileRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/referrals', referralRoutes);
app.use('/api/file', fileRoutes);

// Start the server
const PORT = 3000;

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port http://localhost:${PORT}...`),
);

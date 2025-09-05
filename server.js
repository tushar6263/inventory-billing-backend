import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './src/routes/auth.routes.js';
import productsRoutes from './src/routes/products.routes.js';
import contactsRoutes from './src/routes/contacts.routes.js';
import transactionsRoutes from './src/routes/transactions.routes.js';
import reportsRoutes from './src/routes/reports.routes.js';

import { connectDB } from './src/config/db.js';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api', productsRoutes);
app.use('/api', contactsRoutes);
app.use('/api', transactionsRoutes);
app.use('/api', reportsRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const start = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server listening on http://localhost:${port}`));
  } catch (e) {
    console.error('Failed to start', e);
  }
};

start();

import express from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../middleware/errorHandler.js';
import { formatResponse } from '../utils/helpers.js';
import { getConnectionInfo } from '../config/database.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const dbInfo = getConnectionInfo();
  const dbStatus = dbInfo.connected ? 'connected' : 'disconnected';
  
  // Try to ping the database for verification
  let dbPing = false;
  if (dbInfo.connected) {
    try {
      await mongoose.connection.db.admin().ping();
      dbPing = true;
    } catch (error) {
      dbPing = false;
    }
  }
  
  const healthData = {
    status: dbStatus === 'connected' && dbPing ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      connected: dbInfo.connected,
      ping: dbPing,
      host: dbInfo.host || null,
      name: dbInfo.database || null,
      readyState: dbInfo.readyState
    },
    server: {
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000
    },
    version: process.env.npm_package_version || '1.0.0'
  };
  
  const statusCode = (dbStatus === 'connected' && dbPing) ? 200 : 503;
  res.status(statusCode).json(formatResponse(healthData, 'Health check', statusCode));
}));

export default router;


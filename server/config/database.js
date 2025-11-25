import mongoose from 'mongoose';
import logger from '../middleware/logger.js';

let isConnecting = false;
let retryCount = 0;
const MAX_RETRIES = 10;

const connectDB = async () => {
  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    logger.debug('Connection attempt already in progress...');
    return;
  }

  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    logger.debug('MongoDB already connected');
    return;
  }

  isConnecting = true;

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitsum_portfolio';
    
    logger.info(`Attempting to connect to MongoDB... (Attempt ${retryCount + 1})`);
    logger.debug(`MongoDB URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      w: 'majority'
    });
    
    logger.info(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    logger.info(`   Database: ${conn.connection.name}`);
    logger.info(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    retryCount = 0; // Reset retry count on successful connection
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err.message);
      isConnecting = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
      isConnecting = false;
      retryCount = 0;
      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        if (mongoose.connection.readyState === 0) {
          connectDB();
        }
      }, 5000);
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected successfully');
      retryCount = 0;
    });
    
    mongoose.connection.on('connecting', () => {
      logger.info('🔄 MongoDB connecting...');
    });
    
    // Verify connection with a test query
    try {
      await mongoose.connection.db.admin().ping();
      logger.info('✅ MongoDB connection verified with ping');
    } catch (pingError) {
      logger.warn('⚠️  MongoDB ping test failed:', pingError.message);
    }
    
  } catch (error) {
    retryCount++;
    isConnecting = false;
    
    logger.error(`❌ Database connection error (Attempt ${retryCount}):`, error.message);
    
    if (retryCount < MAX_RETRIES) {
      const delay = Math.min(5000 * retryCount, 30000); // Exponential backoff, max 30s
      logger.info(`⏳ Retrying database connection in ${delay / 1000} seconds... (${retryCount}/${MAX_RETRIES})`);
      
      setTimeout(() => {
        connectDB();
      }, delay);
    } else {
      logger.error(`❌ Maximum retry attempts (${MAX_RETRIES}) reached. Please check:`);
      logger.error('   1. MongoDB is running');
      logger.error('   2. MONGODB_URI in .env is correct');
      logger.error('   3. Network connectivity');
      logger.warn('⚠️  Server will continue without database connection. Some features may not work.');
    }
  } finally {
    isConnecting = false;
  }
};

// Export connection status checker
export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Export connection info
export const getConnectionInfo = () => {
  if (mongoose.connection.readyState === 1) {
    return {
      connected: true,
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    };
  }
  return {
    connected: false,
    readyState: mongoose.connection.readyState
  };
};

export default connectDB;


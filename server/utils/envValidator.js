/**
 * Environment Variable Validation
 * Ensures all required environment variables are set
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const optionalEnvVars = {
  PORT: '5000',
  JWT_EXPIRES_IN: '7d',
  NODE_ENV: 'development',
  FRONTEND_URL: 'http://localhost:5173',
  LOG_LEVEL: 'info'
};

export const validateEnv = () => {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }

  // Check if using default JWT_SECRET
  if (process.env.JWT_SECRET === 'your-secret-key' || !process.env.JWT_SECRET) {
    warnings.push('Using default or weak JWT_SECRET. Change this in production!');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (warnings.length > 0) {
    warnings.forEach(warning => {
      console.warn(`WARNING: ${warning}`);
    });
  }

  // Set defaults for optional variables
  Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  });

  return true;
};


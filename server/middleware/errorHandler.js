import { AppError } from '../utils/errors.js';
import logger from './logger.js';

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Set default error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  if (err.statusCode >= 500) {
    logger.error('Server Error:', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      user: req.user?.username || 'anonymous'
    });
  } else {
    logger.warn('Client Error:', {
      error: err.message,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      user: req.user?.username || 'anonymous'
    });
  }

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err.message,
      stack: err.stack,
      ...(err.errors && { errors: err.errors })
    });
  }

  // Production error response
  // Operational errors: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }

  // Programming errors: don't leak error details
  return res.status(500).json({
    success: false,
    status: 'error',
    error: 'Something went wrong!'
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
};


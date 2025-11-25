import express from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validate, sanitizeInput } from '../middleware/validation.js';
import { authValidation } from '../utils/validators.js';
import { UnauthorizedError } from '../utils/errors.js';
import { formatResponse } from '../utils/helpers.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import User from '../models/User.js';

const router = express.Router();

// Login
router.post('/login',
  authLimiter,
  sanitizeInput,
  authValidation.login,
  validate,
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json(formatResponse({
      token,
      user: { id: user._id, username: user.username }
    }, 'Login successful'));
  })
);

// Verify token
router.get('/verify', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Token required');
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
      if (err) {
        reject(new UnauthorizedError('Invalid token'));
      } else {
        resolve(res.json(formatResponse({ user: decoded }, 'Token is valid')));
      }
    });
  });
}));

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json(formatResponse(null, 'Logged out successfully'));
});

export default router;


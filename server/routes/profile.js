import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validate, sanitizeInput } from '../middleware/validation.js';
import { profileValidation } from '../utils/validators.js';
import { FileUploadError } from '../utils/errors.js';
import { deleteFile, formatResponse } from '../utils/helpers.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// Get profile
router.get('/', asyncHandler(async (req, res) => {
  const profile = await Profile.getProfile();
  res.json(formatResponse(profile, 'Profile fetched successfully'));
}));

// Update profile (protected)
router.put('/',
  authenticateToken,
  sanitizeInput,
  profileValidation.update,
  validate,
  asyncHandler(async (req, res) => {
    let profile = await Profile.findOne();
    
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }

    res.json(formatResponse(profile, 'Profile updated successfully'));
  })
);

// Upload profile image (protected)
router.post('/image',
  authenticateToken,
  uploadLimiter,
  upload.single('profileImage'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new FileUploadError('No file uploaded');
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({ profile_image: imageUrl });
    } else {
      // Delete old image if exists
      if (profile.profile_image) {
        await deleteFile(profile.profile_image);
      }
      profile.profile_image = imageUrl;
      await profile.save();
    }

    res.json(formatResponse({ imageUrl }, 'Profile image uploaded successfully'));
  })
);

export default router;


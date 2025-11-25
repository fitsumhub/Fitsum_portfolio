import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validate, sanitizeInput } from '../middleware/validation.js';
import { youtubeValidation, queryValidation } from '../utils/validators.js';
import { NotFoundError } from '../utils/errors.js';
import { paginate, formatResponse } from '../utils/helpers.js';
import YouTube from '../models/YouTube.js';

const router = express.Router();

// Get all YouTube videos with pagination
router.get('/',
  queryValidation.pagination,
  queryValidation.search,
  validate,
  asyncHandler(async (req, res) => {
    const result = await paginate(YouTube, {}, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort || 'published_at',
      order: req.query.order || 'desc',
      search: req.query.search
    });
    
    res.json({
      ...formatResponse(result.data, 'Videos fetched successfully'),
      pagination: result.pagination
    });
  })
);

// Get single video
router.get('/:id',
  youtubeValidation.update[0], // Uses same ID validation
  validate,
  asyncHandler(async (req, res) => {
    const video = await YouTube.findById(req.params.id);
    if (!video) {
      throw new NotFoundError('Video');
    }
    res.json(formatResponse(video, 'Video fetched successfully'));
  })
);

// Get videos by channel
router.get('/channel/:channel',
  queryValidation.pagination,
  validate,
  asyncHandler(async (req, res) => {
    const result = await paginate(YouTube, { channel: req.params.channel }, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort || 'published_at',
      order: req.query.order || 'desc'
    });
    
    res.json({
      ...formatResponse(result.data, 'Channel videos fetched successfully'),
      pagination: result.pagination
    });
  })
);

// Create video (protected)
router.post('/',
  authenticateToken,
  sanitizeInput,
  youtubeValidation.create,
  validate,
  asyncHandler(async (req, res) => {
    const video = await YouTube.create(req.body);
    res.status(201).json(formatResponse(video, 'YouTube video created successfully', 201));
  })
);

// Update video (protected)
router.put('/:id',
  authenticateToken,
  sanitizeInput,
  youtubeValidation.update,
  validate,
  asyncHandler(async (req, res) => {
    const video = await YouTube.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!video) {
      throw new NotFoundError('Video');
    }

    res.json(formatResponse(video, 'YouTube video updated successfully'));
  })
);

// Delete video (protected)
router.delete('/:id',
  authenticateToken,
  youtubeValidation.update[0],
  validate,
  asyncHandler(async (req, res) => {
    const video = await YouTube.findByIdAndDelete(req.params.id);
    
    if (!video) {
      throw new NotFoundError('Video');
    }

    res.json(formatResponse(null, 'YouTube video deleted successfully'));
  })
);

// Import videos (protected) - placeholder for YouTube API integration
router.post('/import',
  authenticateToken,
  asyncHandler(async (req, res) => {
    // This would integrate with YouTube Data API v3
    res.json(formatResponse([], 'YouTube import feature - to be implemented with YouTube API'));
  })
);

export default router;


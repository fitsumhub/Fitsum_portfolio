import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validate, sanitizeInput } from '../middleware/validation.js';
import { testimonialValidation, queryValidation } from '../utils/validators.js';
import { NotFoundError, FileUploadError } from '../utils/errors.js';
import { paginate, deleteFile, formatResponse } from '../utils/helpers.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// Get all testimonials with pagination
router.get('/',
  queryValidation.pagination,
  queryValidation.search,
  validate,
  asyncHandler(async (req, res) => {
    const result = await paginate(Testimonial, {}, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort || 'order_index',
      order: req.query.order || 'asc',
      search: req.query.search,
      published: req.query.published
    });
    
    res.json({
      ...formatResponse(result.data, 'Testimonials fetched successfully'),
      pagination: result.pagination
    });
  })
);

// Get single testimonial
router.get('/:id',
  testimonialValidation.update[0], // Uses same ID validation
  validate,
  asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new NotFoundError('Testimonial');
    }
    res.json(formatResponse(testimonial, 'Testimonial fetched successfully'));
  })
);

// Create testimonial (protected)
router.post('/',
  authenticateToken,
  sanitizeInput,
  testimonialValidation.create,
  validate,
  asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(formatResponse(testimonial, 'Testimonial created successfully', 201));
  })
);

// Update testimonial (protected)
router.put('/:id',
  authenticateToken,
  sanitizeInput,
  testimonialValidation.update,
  validate,
  asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      throw new NotFoundError('Testimonial');
    }

    res.json(formatResponse(testimonial, 'Testimonial updated successfully'));
  })
);

// Delete testimonial (protected)
router.delete('/:id',
  authenticateToken,
  testimonialValidation.update[0],
  validate,
  asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      throw new NotFoundError('Testimonial');
    }

    // Delete associated avatar file
    if (testimonial.avatar_url) {
      await deleteFile(testimonial.avatar_url);
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    res.json(formatResponse(null, 'Testimonial deleted successfully'));
  })
);

// Upload testimonial avatar (protected)
router.post('/:id/avatar',
  authenticateToken,
  uploadLimiter,
  upload.single('avatar'),
  testimonialValidation.update[0],
  validate,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new FileUploadError('No file uploaded');
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new NotFoundError('Testimonial');
    }

    // Delete old avatar if exists
    if (testimonial.avatar_url) {
      await deleteFile(testimonial.avatar_url);
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    testimonial.avatar_url = avatarUrl;
    await testimonial.save();

    res.json(formatResponse({ avatarUrl }, 'Testimonial avatar uploaded successfully'));
  })
);

// Publish/Unpublish testimonial (protected)
router.patch('/:id/publish',
  authenticateToken,
  testimonialValidation.update[0],
  validate,
  asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new NotFoundError('Testimonial');
    }

    testimonial.published = req.body.published !== undefined ? req.body.published : !testimonial.published;
    await testimonial.save();

    res.json(formatResponse(testimonial, `Testimonial ${testimonial.published ? 'published' : 'unpublished'} successfully`));
  })
);

export default router;


import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validate, sanitizeInput } from '../middleware/validation.js';
import { queryValidation } from '../utils/validators.js';
import { NotFoundError, FileUploadError } from '../utils/errors.js';
import { paginate, deleteFile, formatResponse } from '../utils/helpers.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { param } from 'express-validator';
import Image from '../models/Image.js';

const router = express.Router();

// Get all images (with optional category filter and pagination)
router.get('/',
  queryValidation.pagination,
  queryValidation.search,
  validate,
  asyncHandler(async (req, res) => {
    const { category } = req.query;
    const query = category ? { category } : {};
    
    const result = await paginate(Image, query, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort || 'createdAt',
      order: req.query.order || 'desc',
      search: req.query.search
    });
    
    res.json({
      ...formatResponse(result.data, 'Images fetched successfully'),
      pagination: result.pagination
    });
  })
);

// Get image categories
router.get('/categories/list', asyncHandler(async (req, res) => {
  const categories = await Image.distinct('category');
  res.json(formatResponse(categories, 'Categories fetched successfully'));
}));

// Get single image
router.get('/:id',
  param('id').isMongoId().withMessage('Invalid image ID'),
  validate,
  asyncHandler(async (req, res) => {
    const image = await Image.findById(req.params.id);
    if (!image) {
      throw new NotFoundError('Image');
    }
    res.json(formatResponse(image, 'Image fetched successfully'));
  })
);

// Upload image (protected)
router.post('/upload',
  authenticateToken,
  uploadLimiter,
  upload.single('image'),
  sanitizeInput,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new FileUploadError('No file uploaded');
    }

    const { category = 'general', alt_text = '' } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const image = await Image.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      url: imageUrl,
      category,
      alt_text,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    res.status(201).json(formatResponse(image, 'Image uploaded successfully', 201));
  })
);

// Delete image (protected)
router.delete('/:id',
  authenticateToken,
  param('id').isMongoId().withMessage('Invalid image ID'),
  validate,
  asyncHandler(async (req, res) => {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      throw new NotFoundError('Image');
    }

    // Delete file from filesystem
    await deleteFile(image.url);

    await Image.findByIdAndDelete(req.params.id);

    res.json(formatResponse(null, 'Image deleted successfully'));
  })
);

export default router;


import { body, param, query } from 'express-validator';

/**
 * Project validation rules
 */
export const projectValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('category')
      .optional()
      .trim()
      .isIn(['Web Development', 'Mobile Development', 'Desktop Development', 'Other'])
      .withMessage('Invalid category'),
    body('technologies')
      .optional()
      .isArray().withMessage('Technologies must be an array')
      .custom((value) => {
        if (value.length > 20) {
          throw new Error('Maximum 20 technologies allowed');
        }
        return true;
      }),
    body('github_url')
      .optional()
      .isURL().withMessage('GitHub URL must be a valid URL'),
    body('live_url')
      .optional()
      .isURL().withMessage('Live URL must be a valid URL'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
    body('status')
      .optional()
      .trim()
      .isIn(['Live', 'Prototype', 'Completed', 'In Progress', 'Draft'])
      .withMessage('Invalid status'),
    body('order_index')
      .optional()
      .isInt({ min: 0 }).withMessage('Order index must be a non-negative integer')
  ],
  
  update: [
    param('id')
      .isMongoId().withMessage('Invalid project ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('category')
      .optional()
      .trim()
      .isIn(['Web Development', 'Mobile Development', 'Desktop Development', 'Other'])
      .withMessage('Invalid category'),
    body('status')
      .optional()
      .trim()
      .isIn(['Live', 'Prototype', 'Completed', 'In Progress', 'Draft'])
      .withMessage('Invalid status')
  ],
  
  getById: [
    param('id')
      .isMongoId().withMessage('Invalid project ID')
  ],
  
  delete: [
    param('id')
      .isMongoId().withMessage('Invalid project ID')
  ]
};

/**
 * Profile validation rules
 */
export const profileValidation = {
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email address'),
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
      .withMessage('Invalid phone number format'),
    body('website')
      .optional()
      .trim()
      .isURL().withMessage('Website must be a valid URL'),
    body('github_url')
      .optional()
      .trim()
      .isURL().withMessage('GitHub URL must be a valid URL'),
    body('linkedin_url')
      .optional()
      .trim()
      .isURL().withMessage('LinkedIn URL must be a valid URL')
  ]
};

/**
 * Authentication validation rules
 */
export const authValidation = {
  login: [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]
};

/**
 * Testimonial validation rules
 */
export const testimonialValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('position')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Position must be less than 100 characters'),
    body('company')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Company must be less than 100 characters'),
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean')
  ],
  
  update: [
    param('id')
      .isMongoId().withMessage('Invalid testimonial ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters')
  ]
};

/**
 * YouTube video validation rules
 */
export const youtubeValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
    body('url')
      .optional()
      .trim()
      .isURL().withMessage('URL must be a valid URL'),
    body('channel')
      .trim()
      .notEmpty().withMessage('Channel is required')
      .isLength({ max: 100 }).withMessage('Channel must be less than 100 characters')
  ],
  
  update: [
    param('id')
      .isMongoId().withMessage('Invalid video ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters')
  ]
};

/**
 * Query parameter validation for pagination and filtering
 */
export const queryValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
      .toInt(),
    query('sort')
      .optional()
      .trim()
      .isIn(['createdAt', 'updatedAt', 'title', 'order_index']).withMessage('Invalid sort field'),
    query('order')
      .optional()
      .trim()
      .isIn(['asc', 'desc']).withMessage('Order must be asc or desc')
  ],
  
  search: [
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1 and 100 characters')
  ]
};


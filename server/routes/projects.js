import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validate, sanitizeInput } from '../middleware/validation.js';
import { projectValidation, queryValidation } from '../utils/validators.js';
import { NotFoundError, FileUploadError } from '../utils/errors.js';
import { paginate, deleteFile, formatResponse } from '../utils/helpers.js';
import Project from '../models/Project.js';

const router = express.Router();

// Get all projects with pagination and filtering
router.get('/', 
  queryValidation.pagination,
  queryValidation.search,
  validate,
  asyncHandler(async (req, res) => {
    const result = await paginate(Project, {}, {
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort || 'order_index',
      order: req.query.order || 'asc',
      search: req.query.search,
      published: req.query.published
    });
    
    res.json({
      ...formatResponse(result.data, 'Projects fetched successfully', 200),
      pagination: result.pagination
    });
  })
);

// Get single project
router.get('/:id',
  projectValidation.getById,
  validate,
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new NotFoundError('Project');
    }
    res.json(formatResponse(project, 'Project fetched successfully'));
  })
);

// Create project (protected)
router.post('/',
  authenticateToken,
  sanitizeInput,
  projectValidation.create,
  validate,
  asyncHandler(async (req, res) => {
    const project = await Project.create(req.body);
    res.status(201).json(formatResponse(project, 'Project created successfully', 201));
  })
);

// Update project (protected)
router.put('/:id',
  authenticateToken,
  sanitizeInput,
  projectValidation.update,
  validate,
  asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      throw new NotFoundError('Project');
    }

    res.json(formatResponse(project, 'Project updated successfully'));
  })
);

// Delete project (protected)
router.delete('/:id',
  authenticateToken,
  projectValidation.delete,
  validate,
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      throw new NotFoundError('Project');
    }

    // Delete associated image file
    if (project.image_url) {
      await deleteFile(project.image_url);
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json(formatResponse(null, 'Project deleted successfully'));
  })
);

// Upload project image (protected)
router.post('/:id/image',
  authenticateToken,
  upload.single('projectImage'),
  projectValidation.getById,
  validate,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new FileUploadError('No file uploaded');
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new NotFoundError('Project');
    }

    // Delete old image if exists
    if (project.image_url) {
      await deleteFile(project.image_url);
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    project.image_url = imageUrl;
    await project.save();

    res.json(formatResponse({ imageUrl }, 'Project image uploaded successfully'));
  })
);

// Publish/Unpublish project (protected)
router.patch('/:id/publish',
  authenticateToken,
  projectValidation.getById,
  validate,
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new NotFoundError('Project');
    }

    project.published = req.body.published !== undefined ? req.body.published : !project.published;
    await project.save();

    res.json(formatResponse(project, `Project ${project.published ? 'published' : 'unpublished'} successfully`));
  })
);

export default router;


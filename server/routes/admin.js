import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { formatResponse } from '../utils/helpers.js';
import Project from '../models/Project.js';
import Testimonial from '../models/Testimonial.js';
import YouTube from '../models/YouTube.js';
import Profile from '../models/Profile.js';
import Image from '../models/Image.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// Get dashboard statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const [projects, testimonials, videos, images, profile] = await Promise.all([
    Project.countDocuments(),
    Testimonial.countDocuments(),
    YouTube.countDocuments(),
    Image.countDocuments(),
    Profile.countDocuments()
  ]);

  const [publishedProjects, publishedTestimonials] = await Promise.all([
    Project.countDocuments({ published: true }),
    Testimonial.countDocuments({ published: true })
  ]);

  const stats = {
    total: {
      projects,
      testimonials,
      videos,
      images,
      profile
    },
    published: {
      projects: publishedProjects,
      testimonials: publishedTestimonials
    },
    draft: {
      projects: projects - publishedProjects,
      testimonials: testimonials - publishedTestimonials
    }
  };

  res.json(formatResponse(stats, 'Dashboard statistics fetched successfully'));
}));

// Get recent activity (last 10 items)
router.get('/activity', asyncHandler(async (req, res) => {
  const [recentProjects, recentTestimonials, recentVideos] = await Promise.all([
    Project.find().sort({ updatedAt: -1 }).limit(5).select('title updatedAt published').lean(),
    Testimonial.find().sort({ updatedAt: -1 }).limit(5).select('name updatedAt published').lean(),
    YouTube.find().sort({ updatedAt: -1 }).limit(5).select('title updatedAt').lean()
  ]);

  const activity = [
    ...recentProjects.map(p => ({ type: 'project', ...p })),
    ...recentTestimonials.map(t => ({ type: 'testimonial', ...t })),
    ...recentVideos.map(v => ({ type: 'video', ...v }))
  ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 10);

  res.json(formatResponse(activity, 'Recent activity fetched successfully'));
}));

export default router;


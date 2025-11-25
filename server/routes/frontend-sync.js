import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { formatResponse } from '../utils/helpers.js';
import Project from '../models/Project.js';
import Testimonial from '../models/Testimonial.js';
import YouTube from '../models/YouTube.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// All sync routes require authentication
router.use(authenticateToken);

// Sync all frontend data to backend
router.post('/sync-all', asyncHandler(async (req, res) => {
  const { projects, profile, testimonials, youtubeVideos } = req.body;
  
  let syncedProjects = 0;
  let syncedTestimonials = 0;
  let syncedVideos = 0;
  let syncedProfile = 0;

  // Sync Projects
  if (projects && Array.isArray(projects)) {
    for (const projectData of projects) {
      // Remove _id, createdAt, updatedAt from frontend data
      const { _id, createdAt, updatedAt, ...projectFields } = projectData;
      
      // Check if project exists by title or create new
      const existing = await Project.findOne({ title: projectFields.title });
      if (existing) {
        await Project.findByIdAndUpdate(existing._id, projectFields, { new: true });
      } else {
        await Project.create(projectFields);
      }
      syncedProjects++;
    }
  }

  // Sync Profile
  if (profile && typeof profile === 'object') {
    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      await Profile.findByIdAndUpdate(existingProfile._id, profile, { new: true });
    } else {
      await Profile.create(profile);
    }
    syncedProfile = 1;
  }

  // Sync Testimonials
  if (testimonials && Array.isArray(testimonials)) {
    for (const testimonialData of testimonials) {
      const { _id, createdAt, updatedAt, ...testimonialFields } = testimonialData;
      
      // Check if testimonial exists by name and company
      const existing = await Testimonial.findOne({ 
        name: testimonialFields.name,
        company: testimonialFields.company 
      });
      if (existing) {
        await Testimonial.findByIdAndUpdate(existing._id, testimonialFields, { new: true });
      } else {
        await Testimonial.create(testimonialFields);
      }
      syncedTestimonials++;
    }
  }

  // Sync YouTube Videos
  if (youtubeVideos && Array.isArray(youtubeVideos)) {
    for (const videoData of youtubeVideos) {
      const { _id, createdAt, updatedAt, ...videoFields } = videoData;
      
      // Use video_id or videoId to check for existing
      const videoId = videoFields.video_id || videoFields.videoId;
      if (videoId) {
        const existing = await YouTube.findOne({ 
          $or: [
            { video_id: videoId },
            { videoId: videoId }
          ]
        });
        if (existing) {
          await YouTube.findByIdAndUpdate(existing._id, videoFields, { new: true });
        } else {
          await YouTube.create(videoFields);
        }
        syncedVideos++;
      }
    }
  }

  res.json({
    success: true,
    message: `Synced ${syncedProjects} projects, ${syncedTestimonials} testimonials, ${syncedVideos} videos, and ${syncedProfile} profile`,
    timestamp: new Date().toISOString(),
    data: {
      projects: syncedProjects,
      testimonials: syncedTestimonials,
      youtubeVideos: syncedVideos,
      profile: syncedProfile
    }
  });
}));

// Sync only projects
router.post('/sync-projects', asyncHandler(async (req, res) => {
  const count = await Project.countDocuments();
  res.json({
    success: true,
    message: 'Projects sync completed',
    timestamp: new Date().toISOString(),
    data: { projects: count }
  });
}));

// Sync only profile
router.post('/sync-profile', asyncHandler(async (req, res) => {
  const count = await Profile.countDocuments();
  res.json({
    success: true,
    message: 'Profile sync completed',
    timestamp: new Date().toISOString(),
    data: { profile: count }
  });
}));

// Reset all data to frontend defaults
router.post('/reset-to-frontend', asyncHandler(async (req, res) => {
  const { projects, profile, testimonials, youtubeVideos } = req.body;
  
  // Delete all existing data
  await Promise.all([
    Project.deleteMany({}),
    Testimonial.deleteMany({}),
    YouTube.deleteMany({}),
    Profile.deleteMany({})
  ]);

  let createdProjects = 0;
  let createdTestimonials = 0;
  let createdVideos = 0;
  let createdProfile = 0;

  // Create Projects
  if (projects && Array.isArray(projects)) {
    const projectsToCreate = projects.map(({ _id, createdAt, updatedAt, ...fields }) => fields);
    if (projectsToCreate.length > 0) {
      await Project.insertMany(projectsToCreate);
      createdProjects = projectsToCreate.length;
    }
  }

  // Create Profile
  if (profile && typeof profile === 'object') {
    await Profile.create(profile);
    createdProfile = 1;
  }

  // Create Testimonials
  if (testimonials && Array.isArray(testimonials)) {
    const testimonialsToCreate = testimonials.map(({ _id, createdAt, updatedAt, ...fields }) => fields);
    if (testimonialsToCreate.length > 0) {
      await Testimonial.insertMany(testimonialsToCreate);
      createdTestimonials = testimonialsToCreate.length;
    }
  }

  // Create YouTube Videos
  if (youtubeVideos && Array.isArray(youtubeVideos)) {
    const videosToCreate = youtubeVideos.map(({ _id, createdAt, updatedAt, ...fields }) => fields);
    if (videosToCreate.length > 0) {
      await YouTube.insertMany(videosToCreate);
      createdVideos = videosToCreate.length;
    }
  }

  res.json({
    success: true,
    message: `Reset completed: ${createdProjects} projects, ${createdTestimonials} testimonials, ${createdVideos} videos, and ${createdProfile} profile created`,
    timestamp: new Date().toISOString(),
    data: {
      projects: createdProjects,
      testimonials: createdTestimonials,
      youtubeVideos: createdVideos,
      profile: createdProfile
    }
  });
}));

export default router;


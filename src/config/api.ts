// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VERIFY: '/auth/verify',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_IMAGE: '/profile/image',
  
  // Projects
  PROJECTS: '/projects',
  PROJECT: (id: string) => `/projects/${id}`,
  PROJECT_IMAGE: (id: string) => `/projects/${id}/image`,
  
  // YouTube
  YOUTUBE: '/youtube',
  YOUTUBE_VIDEO: (id: string) => `/youtube/${id}`,
  YOUTUBE_CHANNEL: (channel: string) => `/youtube/channel/${channel}`,
  YOUTUBE_IMPORT: '/youtube/import',
  
  // Testimonials
  TESTIMONIALS: '/testimonials',
  TESTIMONIAL: (id: string) => `/testimonials/${id}`,
  TESTIMONIAL_AVATAR: (id: string) => `/testimonials/${id}/avatar`,
  
  // Images
  IMAGES: '/images',
  IMAGE: (id: string) => `/images/${id}`,
  IMAGE_UPLOAD: '/images/upload',
  IMAGE_CATEGORIES: '/images/categories/list',
  
  // Health
  HEALTH: '/health',
} as const;

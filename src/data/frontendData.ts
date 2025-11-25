import type { Project, Profile, Testimonial, YouTubeVideo } from '../contexts/DataContext';

// Generate a simple ObjectId-like string
const generateObjectId = () => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const random = Math.random().toString(16).substring(2, 8);
  const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  return timestamp + random + counter;
};

const now = new Date().toISOString();

// Frontend Projects Data
export const frontendProjects: Project[] = [
  {
    _id: generateObjectId(),
    title: 'AplusEthiopia.com',
    description: 'Educational platform for Grade 12 and Freshman students',
    image_url: '/images/profile.jpg',
    github_url: 'https://github.com/fitsumhub',
    live_url: 'https://aplusethiopia.com',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'SEO'],
    category: 'Web Development',
    featured: true,
    status: 'Live',
    order_index: 0,
    createdAt: now,
    updatedAt: now
  },
  {
    _id: generateObjectId(),
    title: 'APlus Library',
    description: 'Free platform for downloading books and PDFs',
    image_url: '/images/profile.jpg',
    github_url: 'https://github.com/fitsumhub',
    live_url: '#',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    category: 'Web Development',
    featured: true,
    status: 'Live',
    order_index: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    _id: generateObjectId(),
    title: 'FreshmanQuiz Website',
    description: 'Quiz-based learning platform with course selection',
    image_url: '/images/profile.jpg',
    github_url: 'https://github.com/fitsumhub',
    live_url: '#',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Admin Dashboard'],
    category: 'Web Development',
    featured: true,
    status: 'Live',
    order_index: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    _id: generateObjectId(),
    title: 'AI Messaging App',
    description: 'Chat app with AI auto-reply integration',
    image_url: '/images/profile.jpg',
    github_url: 'https://github.com/fitsumhub',
    live_url: '#',
    technologies: ['React Native', 'AI Integration', 'Firebase', 'Expo'],
    category: 'Mobile Development',
    featured: true,
    status: 'Prototype',
    order_index: 3,
    createdAt: now,
    updatedAt: now
  },
  {
    _id: generateObjectId(),
    title: 'Java Employee Management',
    description: 'Desktop app with CRUD operations and authentication',
    image_url: '/images/profile.jpg',
    github_url: 'https://github.com/fitsumhub',
    live_url: '#',
    technologies: ['Java', 'Java Swing', 'MySQL', 'SQLite', 'CSV Export'],
    category: 'Desktop Development',
    featured: true,
    status: 'Completed',
    order_index: 4,
    createdAt: now,
    updatedAt: now
  },
  {
    _id: generateObjectId(),
    title: 'YouTube Meta Tag Generator',
    description: 'React Native app for smart YouTube tag generation',
    image_url: '/images/profile.jpg',
    github_url: 'https://github.com/fitsumhub',
    live_url: '#',
    technologies: ['React Native', 'Expo', 'AI Integration', 'Clipboard API'],
    category: 'Mobile Development',
    featured: true,
    status: 'Live',
    order_index: 5,
    createdAt: now,
    updatedAt: now
  }
];

// Frontend Profile Data
export const frontendProfile: Profile = {
  name: 'Fitsum Enunu',
  title: 'Web Developer & Tech Creator | Business • Tech • Hustle',
  description: 'Passionate about building innovative solutions and creating engaging content. I help students learn programming and build real-world projects. Creator of educational content with 100K+ YouTube subscribers and 24.4K Telegram followers. DM for promotions.',
  location: 'Ethiopia',
  email: 'fitsumenunu21@gmail.com',
  phone: '0920209609',
  website: 'https://fitsumenunu.com',
  github_url: 'https://github.com/fitsumhub',
  linkedin_url: 'https://linkedin.com/in/fitsum-enunu',
  youtube_ethiopia_url: 'https://www.youtube.com/@AplusEthiopia',
  youtube_hustler_url: 'https://www.youtube.com/@AplusHustler',
  telegram_username: 'fitsum00000',
  telegram_channel_url: 'https://t.me/AplusHustler',
  profile_image: '/images/profile.jpg',
  resume_url: ''
};

// Frontend Testimonials Data
export const frontendTestimonials: Testimonial[] = [
  {
    _id: generateObjectId(),
    name: 'Dr. Samuel Tadesse',
    position: 'Computer Science Professor',
    company: 'Addis Ababa University',
    content: "Fitsum is an exceptional student with a natural talent for problem-solving. His dedication to learning and helping others makes him stand out. He has a bright future in technology.",
    avatar_url: '',
    rating: 5,
    featured: true,
    order_index: 0,
    createdAt: now,
    updatedAt: now
  },
  {
    _id: generateObjectId(),
    name: 'Sarah Johnson',
    position: 'Tech Lead',
    company: 'Digital Solutions Inc',
    content: "Working with Fitsum has been a pleasure. His code quality is excellent, and his ability to communicate complex technical concepts clearly is impressive. A true professional.",
    avatar_url: '',
    rating: 5,
    featured: true,
    order_index: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    _id: generateObjectId(),
    name: 'Michael Chen',
    position: 'Senior Developer',
    company: 'WebTech Global',
    content: "Fitsum's YouTube channel helped me learn React. His teaching style is clear and engaging. He breaks down complex topics into understandable pieces. Highly recommended!",
    avatar_url: '',
    rating: 5,
    featured: true,
    order_index: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    _id: generateObjectId(),
    name: 'Abeba Mekonnen',
    position: 'Student',
    company: 'A+ Ethiopia Subscriber',
    content: "As someone new to programming, Fitsum's tutorials have been invaluable. His patience and clear explanations made learning to code accessible and enjoyable. Thank you!",
    avatar_url: '',
    rating: 5,
    featured: true,
    order_index: 3,
    createdAt: now,
    updatedAt: now
  },
  {
    _id: generateObjectId(),
    name: 'David Williams',
    position: 'Project Manager',
    company: 'Innovation Labs',
    content: "Fitsum delivered our project ahead of schedule with exceptional quality. His technical expertise and problem-solving abilities are outstanding. A reliable team member.",
    avatar_url: '',
    rating: 5,
    featured: true,
    order_index: 4,
    createdAt: now,
    updatedAt: now
  }
];

// Frontend YouTube Videos Data
export const frontendYouTubeVideos: YouTubeVideo[] = [
  {
    _id: generateObjectId(),
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of building websites from scratch',
    video_id: 'dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    thumbnail_url: '',
    thumbnail: '',
    channel: 'AplusEthiopia',
    views: 15000,
    featured: true,
    createdAt: now,
    published_at: now
  },
  {
    _id: generateObjectId(),
    title: 'JavaScript Tutorial for Beginners',
    description: 'Master JavaScript basics with practical examples',
    video_id: 'dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    thumbnail_url: '',
    thumbnail: '',
    channel: 'AplusEthiopia',
    views: 22000,
    featured: true,
    createdAt: now,
    published_at: now
  },
  {
    _id: generateObjectId(),
    title: 'React Crash Course',
    description: 'Build modern web applications with React',
    video_id: 'dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    thumbnail_url: '',
    thumbnail: '',
    channel: 'AplusEthiopia',
    views: 18000,
    featured: true,
    createdAt: now,
    published_at: now
  },
  {
    _id: generateObjectId(),
    title: 'Python Programming Guide',
    description: 'Complete Python tutorial for all skill levels',
    video_id: 'dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    thumbnail_url: '',
    thumbnail: '',
    channel: 'AplusEthiopia',
    views: 25000,
    featured: true,
    createdAt: now,
    published_at: now
  }
];

// Export all frontend data
export const frontendData = {
  projects: frontendProjects,
  profile: frontendProfile,
  testimonials: frontendTestimonials,
  youtubeVideos: frontendYouTubeVideos
};


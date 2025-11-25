# Fitsum Portfolio Backend API

Backend server for the Fitsum Portfolio website - A fully functional, error-free CMS.

## Features

- **RESTful API** with Express.js
- **MongoDB database** with Mongoose (with connection pooling and retry logic)
- **JWT authentication** with secure token handling
- **Input validation** using express-validator
- **Error handling** with custom error classes and centralized error middleware
- **Rate limiting** to prevent abuse
- **Request logging** with Winston
- **Security** with Helmet, CORS, and input sanitization
- **File upload handling** with enhanced security (images)
- **CMS Features:**
  - Draft/Published status for content
  - Publish/Unpublish endpoints
  - Content scheduling support
  - Pagination and filtering
  - Search functionality
  - Admin dashboard statistics
- **Media library** with categories and search
- **File cleanup** on content deletion

## Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitsum_portfolio
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=info
```

4. Start MongoDB (if running locally):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services
```

5. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the default password in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile (protected)
- `POST /api/profile/image` - Upload profile image (protected)

### Projects
- `GET /api/projects` - Get all projects (supports pagination, search, filtering)
  - Query params: `?page=1&limit=10&search=term&sort=createdAt&order=desc&published=true`
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `POST /api/projects/:id/image` - Upload project image (protected)
- `PATCH /api/projects/:id/publish` - Publish/Unpublish project (protected)

### YouTube Videos
- `GET /api/youtube` - Get all videos
- `GET /api/youtube/:id` - Get single video
- `GET /api/youtube/channel/:channel` - Get videos by channel
- `POST /api/youtube` - Create video (protected)
- `PUT /api/youtube/:id` - Update video (protected)
- `DELETE /api/youtube/:id` - Delete video (protected)
- `POST /api/youtube/import` - Import videos (protected)

### Testimonials
- `GET /api/testimonials` - Get all testimonials (supports pagination, search, filtering)
  - Query params: `?page=1&limit=10&search=term&sort=order_index&order=asc&published=true`
- `GET /api/testimonials/:id` - Get single testimonial
- `POST /api/testimonials` - Create testimonial (protected)
- `PUT /api/testimonials/:id` - Update testimonial (protected)
- `DELETE /api/testimonials/:id` - Delete testimonial (protected)
- `POST /api/testimonials/:id/avatar` - Upload testimonial avatar (protected)
- `PATCH /api/testimonials/:id/publish` - Publish/Unpublish testimonial (protected)

### Images
- `GET /api/images` - Get all images (supports pagination, search, category filter)
  - Query params: `?page=1&limit=10&search=term&category=general&sort=createdAt&order=desc`
- `GET /api/images/categories/list` - Get image categories
- `GET /api/images/:id` - Get single image
- `POST /api/images/upload` - Upload image (protected)
- `DELETE /api/images/:id` - Delete image (protected)

### Admin Dashboard
- `GET /api/admin/stats` - Get dashboard statistics (protected)
- `GET /api/admin/activity` - Get recent activity (protected)

### Frontend Sync
- `POST /api/frontend-sync/sync-all` - Sync all frontend data to backend (protected)
- `POST /api/frontend-sync/sync-projects` - Sync projects only (protected)
- `POST /api/frontend-sync/sync-profile` - Sync profile only (protected)
- `POST /api/frontend-sync/reset-to-frontend` - Reset to frontend defaults (protected)

### Health
- `GET /api/health` - Health check (returns database status, uptime, environment)

## File Uploads

Uploaded files are stored in the `uploads/` directory and served at `/uploads/:filename`.

**Supported image formats:** JPEG, JPG, PNG, GIF, WEBP  
**Maximum file size:** 5MB  
**Security features:**
- Filename sanitization to prevent path traversal
- MIME type validation
- File extension validation
- Dangerous character filtering

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

**Rate Limiting:**
- General API: 100 requests per 15 minutes per IP
- Authentication: 5 login attempts per 15 minutes per IP
- File uploads: 20 uploads per hour per IP

## Database Models

All models include:
- Input validation at the schema level
- Indexes for better query performance
- Timestamps (createdAt, updatedAt)
- CMS fields (published, publishedAt, scheduledPublish) where applicable

- **User** - Admin users with password hashing
- **Profile** - Portfolio profile information (single document)
- **Project** - Portfolio projects with draft/published status
- **YouTube** - YouTube video information with channel support
- **Testimonial** - Client testimonials with draft/published status
- **Image** - Uploaded images with categories

## Error Handling

The API uses custom error classes for consistent error responses:
- `ValidationError` (400) - Input validation errors
- `NotFoundError` (404) - Resource not found
- `UnauthorizedError` (401) - Authentication required
- `ForbiddenError` (403) - Access denied
- `ConflictError` (409) - Resource conflict
- `FileUploadError` (400) - File upload issues
- `DatabaseError` (500) - Database operation failures

All errors are logged with Winston and return consistent JSON responses.

## Development

The server uses nodemon for auto-reload during development. Any changes to server files will automatically restart the server.

## Production

1. Set a strong `JWT_SECRET` in `.env`
2. Change the default admin password
3. Use a production MongoDB instance (MongoDB Atlas recommended)
4. Set up proper file storage (AWS S3, Cloudinary, etc.)
5. Enable HTTPS
6. Set up proper error logging and monitoring


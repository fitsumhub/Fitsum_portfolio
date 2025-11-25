# Admin Access Guide

## Quick Access

### From Navigation Bar
- Click the **"Admin"** button in the top navigation bar
- Or visit: `http://localhost:5173/login`
- Or visit: `http://localhost:5173/admin`

### Default Credentials
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change this password after first login!

## Admin Features

Once logged in, you'll have access to:

### 📊 Dashboard (`/fitsum`)
- Overview of all content
- Statistics and analytics
- Quick actions
- Data health monitoring
- Frontend data sync

### 👤 Profile Management (`/fitsum/profile`)
- Update personal information
- Manage social media links
- Upload profile image
- Update resume

### 💼 Projects Management (`/fitsum/projects`)
- Create, edit, delete projects
- Upload project images
- Set featured projects
- Manage project status

### 🎥 YouTube Management (`/fitsum/youtube`)
- Add YouTube videos
- Import videos from channels
- Manage video metadata
- Track views and engagement

### 💬 Testimonials (`/fitsum/testimonials`)
- Add client testimonials
- Upload avatars
- Manage ratings
- Set featured testimonials

### 🖼️ Images Library (`/fitsum/images`)
- Upload and manage images
- Organize by categories
- Search and filter images
- Delete unused images

### 🔄 Data Sync (`/fitsum/data-sync`)
- Sync frontend data to database
- Reset database from frontend
- Check backend data status
- View sync history

## API Connection

The admin panel connects to the backend API at:
- **Development:** `http://localhost:5000/api`
- **Production:** Set via `VITE_API_URL` environment variable

### If Backend is Not Running

The admin panel will work in **demo mode** with limited functionality:
- Login with `admin`/`admin123` will work
- Data will be stored locally only
- Some features may not be available

To enable full functionality:
1. Start the backend server (see `BACKEND_SETUP.md`)
2. Ensure MongoDB is running
3. Restart the frontend if needed

## Security Notes

1. **Change Default Password:** Update the admin password immediately
2. **Use HTTPS in Production:** Always use HTTPS for admin access
3. **Token Storage:** Admin tokens are stored in localStorage
4. **Session Management:** Tokens expire after 7 days (configurable)

## Troubleshooting

### Can't Login
- Check if backend server is running
- Verify credentials are correct
- Check browser console for errors
- Try clearing localStorage and logging in again

### API Errors
- Ensure backend server is running on port 5000
- Check MongoDB connection
- Verify CORS settings in backend
- Check network tab in browser DevTools

### Session Expired
- Log out and log back in
- Clear browser localStorage
- Check token expiration settings

## Quick Links

- **Login Page:** `/login` or `/admin`
- **Dashboard:** `/fitsum`
- **Backend Health:** `http://localhost:5000/api/health`
- **Backend Setup:** See `BACKEND_SETUP.md`


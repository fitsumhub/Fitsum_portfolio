# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd server
npm install
```

## Step 2: Create .env File

Create a file named `.env` in the `server` directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitsum_portfolio
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
```

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
- MongoDB should start automatically as a service
- Or run: `net start MongoDB`

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas (Cloud):**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Get your connection string and update `MONGODB_URI` in `.env`

## Step 4: Start the Server

```bash
# Development mode (auto-reload)
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:5000`

## Step 5: Test the API

Open your browser and visit:
- Health check: http://localhost:5000/api/health
- API base: http://localhost:5000/api

## Default Admin Login

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Change this password immediately after first login!**

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if the connection string in `.env` is correct
- For MongoDB Atlas, make sure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in `.env` to a different port (e.g., 5001)
- Update the frontend API URL in `src/config/api.ts` if you change the port

### File Upload Errors
- Make sure the `uploads` directory exists (it will be created automatically)
- Check file permissions on the uploads directory


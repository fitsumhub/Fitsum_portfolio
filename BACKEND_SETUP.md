# Backend Server Setup

## Quick Start

The backend server needs to be running for the admin dashboard and API features to work.

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Install Dependencies (if not already installed)

```bash
npm install
```

### Step 3: Create .env File

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitsum_portfolio
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start MongoDB

**Windows:**
```bash
net start MongoDB
```

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

### Step 5: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Or use the provided scripts:**
- Windows: `start.bat`
- Linux/Mac: `./start.sh`

### Step 6: Verify Server is Running

**Option 1: Test Connection Script (Recommended)**
```bash
npm run test-connection
```

This will test both MongoDB and API server connections.

**Option 2: Manual Check**
Open your browser and visit:
- Health check: http://localhost:5000/api/health
- API base: http://localhost:5000/api

You should see a JSON response indicating the server is running.

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Change this password immediately after first login!**

## Troubleshooting

### Connection Refused Error

If you see `ERR_CONNECTION_REFUSED` errors:
1. Make sure the server is running (check Step 5)
2. Verify the server is running on port 5000
3. Check if another application is using port 5000

### MongoDB Connection Error

1. Make sure MongoDB is running
2. Check if the connection string in `.env` is correct
3. For MongoDB Atlas, make sure your IP is whitelisted

### Port Already in Use

If port 5000 is already in use:
1. Change the `PORT` in `.env` to a different port (e.g., 5001)
2. Update the frontend API URL in `src/config/api.ts`:
   ```typescript
   export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
   ```

## Note

The frontend will work without the backend (using fallback data), but admin features and database sync require the backend server to be running.


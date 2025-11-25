# Deployment Guide

This guide will help you deploy your portfolio to production.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend on Vercel (Free & Easy)

1. **Go to [Vercel](https://vercel.com)**
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your `Fitsum_portfolio` repository

2. **Configure Build Settings:**
   - Framework Preset: Vite
   - Root Directory: `./` (root)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables:**
   - Add `VITE_API_URL` = Your backend URL (e.g., `https://your-backend.railway.app/api`)

4. **Deploy!**
   - Click "Deploy"
   - Your site will be live in ~2 minutes

#### Backend on Railway (Free Tier Available)

1. **Go to [Railway](https://railway.app)**
   - Sign up/login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Service:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Add MongoDB:**
   - In Railway dashboard, click "+ New"
   - Add "MongoDB" service
   - Copy the connection string to `MONGODB_URI`

5. **Get Your Backend URL:**
   - Railway will provide a URL like `https://your-app.railway.app`
   - Update `VITE_API_URL` in Vercel with: `https://your-app.railway.app/api`

---

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend on Netlify

1. **Go to [Netlify](https://netlify.com)**
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Add `VITE_API_URL`

3. **Deploy!**

#### Backend on Render

1. **Go to [Render](https://render.com)**
   - Sign up/login with GitHub
   - Click "New" → "Web Service"
   - Connect your repository

2. **Configure:**
   - Name: `fitsum-portfolio-backend`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables:**
   - Add all required variables (same as Railway)

4. **Add MongoDB:**
   - Click "New" → "MongoDB"
   - Copy connection string to `MONGODB_URI`

---

### Option 3: Full Stack on Vercel (Frontend + API Routes)

If you want everything on Vercel, you can:
1. Deploy frontend as static site
2. Use Vercel Serverless Functions for API (requires code changes)

---

## 📋 Pre-Deployment Checklist

- [ ] Build frontend locally: `npm run build`
- [ ] Test backend locally: `cd server && npm start`
- [ ] Set up MongoDB database (MongoDB Atlas recommended)
- [ ] Prepare environment variables
- [ ] Update API URL in frontend config
- [ ] Test admin login functionality

## 🔧 Environment Variables Needed

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

## 🌐 MongoDB Setup (MongoDB Atlas - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all, or your server IP)
5. Get connection string
6. Use it in `MONGODB_URI`

## ✅ Post-Deployment

1. Test your live site
2. Test admin login at `/login`
3. Sync frontend data to backend
4. Update any hardcoded URLs
5. Set up custom domain (optional)

## 🆘 Troubleshooting

- **CORS errors**: Make sure backend CORS allows your frontend domain
- **API not connecting**: Check `VITE_API_URL` is correct
- **Build fails**: Check Node version (should be 18+)
- **Database connection**: Verify MongoDB URI and network access

---

**Recommended**: Vercel (Frontend) + Railway (Backend) for easiest setup!


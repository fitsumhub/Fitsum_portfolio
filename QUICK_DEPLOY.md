# 🚀 Quick Deployment Guide

## Step 1: Deploy Frontend to Vercel (2 minutes)

1. **Go to [vercel.com](https://vercel.com)**
   - Click "Sign Up" → Login with GitHub
   - Click "Add New Project"
   - Import `fitsumhub/Fitsum_portfolio`

2. **Configure:**
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - **Environment Variables:**
     - `VITE_API_URL` = `https://your-backend.railway.app/api` (we'll get this in step 2)

3. **Click "Deploy"** (you can update the API URL later)

---

## Step 2: Deploy Backend to Railway (5 minutes)

1. **Go to [railway.app](https://railway.app)**
   - Click "Start a New Project"
   - Login with GitHub
   - Select "Deploy from GitHub repo"
   - Choose `Fitsum_portfolio`

2. **Configure Service:**
   - Click on the service → Settings
   - Set **Root Directory** to: `server`
   - Set **Start Command** to: `npm start`

3. **Add MongoDB:**
   - In Railway dashboard, click "+ New"
   - Select "Database" → "Add MongoDB"
   - Wait for it to provision
   - Copy the **MongoDB Connection String**

4. **Add Environment Variables:**
   - Go to your service → Variables tab
   - Add these:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=<paste connection string from step 3>
     JWT_SECRET=<generate a random string>
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=<choose a secure password>
     ```

5. **Get Your Backend URL:**
   - Railway will generate a URL like: `https://fitsum-portfolio-backend-production.up.railway.app`
   - Copy this URL

6. **Update Frontend:**
   - Go back to Vercel
   - Settings → Environment Variables
   - Update `VITE_API_URL` = `https://your-railway-url.railway.app/api`
   - Redeploy

---

## Step 3: Test Your Deployment

1. Visit your Vercel URL
2. Test admin login at: `your-site.vercel.app/login`
3. Sync frontend data in admin panel

---

## 🎉 Done!

Your portfolio is now live!

**Frontend:** `https://your-site.vercel.app`  
**Backend:** `https://your-backend.railway.app`

---

## Alternative: Deploy to Netlify (Frontend)

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import from Git"
3. Connect GitHub → Select repository
4. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy!

---

## Need Help?

Check `DEPLOYMENT.md` for detailed instructions and troubleshooting.


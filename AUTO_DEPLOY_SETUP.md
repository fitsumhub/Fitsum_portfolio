# 🚀 Automatic Deployment Setup

I've created GitHub Actions workflows for automatic deployment! Here's how to set it up:

## Frontend Auto-Deploy to Vercel

### Step 1: Get Vercel Credentials

1. **Go to [vercel.com](https://vercel.com)** and login
2. **Create a project manually first:**
   - Click "Add New Project"
   - Import `fitsumhub/Fitsum_portfolio`
   - Deploy once (this creates the project)
3. **Get your credentials:**
   - Go to Project Settings → General
   - Copy:
     - **Project ID**
     - **Org ID**
   - Go to [Account Settings → Tokens](https://vercel.com/account/tokens)
   - Create new token → Copy **Token**

### Step 2: Add GitHub Secrets

1. **Go to your GitHub repo:** `https://github.com/fitsumhub/Fitsum_portfolio`
2. **Settings → Secrets and variables → Actions**
3. **Add these secrets:**
   - `VERCEL_TOKEN` = Your Vercel token
   - `VERCEL_ORG_ID` = Your Org ID
   - `VERCEL_PROJECT_ID` = Your Project ID
   - `VITE_API_URL` = Your backend URL (e.g., `https://your-backend.railway.app/api`)

### Step 3: Deploy!

- Push to `main` branch → Auto-deploys! 🎉

---

## Backend Auto-Deploy to Railway

### Step 1: Get Railway Credentials

1. **Go to [railway.app](https://railway.app)** and login
2. **Create project:**
   - New Project → Deploy from GitHub
   - Select your repo
   - Set Root Directory: `server`
3. **Get credentials:**
   - Go to your service → Settings
   - Copy **Service ID**
   - Go to [Account Settings → Tokens](https://railway.app/account/tokens)
   - Create new token → Copy **Token**

### Step 2: Add GitHub Secrets

1. **GitHub repo → Settings → Secrets**
2. **Add:**
   - `RAILWAY_TOKEN` = Your Railway token
   - `RAILWAY_SERVICE_ID` = Your Service ID

### Step 3: Set Environment Variables in Railway

In Railway dashboard, add:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<your-password>
FRONTEND_URL=<your-vercel-url>
```

---

## 🎯 Quick Setup (5 minutes)

### Option A: Manual First Deploy (Recommended)

1. **Deploy Frontend to Vercel once manually:**
   - https://vercel.com/new
   - Import repo → Deploy
   - Get credentials → Add to GitHub Secrets

2. **Deploy Backend to Railway once manually:**
   - https://railway.app/new
   - Import repo → Configure
   - Get credentials → Add to GitHub Secrets

3. **Future pushes auto-deploy!** ✨

### Option B: Use GitHub Actions Only

1. Add all secrets to GitHub
2. Push to main → Auto-deploys!

---

## 📝 Secrets Checklist

**Vercel:**
- [ ] VERCEL_TOKEN
- [ ] VERCEL_ORG_ID
- [ ] VERCEL_PROJECT_ID
- [ ] VITE_API_URL

**Railway:**
- [ ] RAILWAY_TOKEN
- [ ] RAILWAY_SERVICE_ID

---

## ✅ After Setup

Every time you push to `main`:
- ✅ Frontend auto-deploys to Vercel
- ✅ Backend auto-deploys to Railway (if server files change)

No manual steps needed! 🚀


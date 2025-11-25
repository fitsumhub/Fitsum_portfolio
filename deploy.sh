#!/bin/bash

# Automated Deployment Script for Fitsum Portfolio
echo "🚀 Starting Deployment Process..."

# Step 1: Build Frontend
echo ""
echo "📦 Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful!"

# Step 2: Deploy to Vercel
echo ""
echo "🌐 Deploying to Vercel..."
npx vercel --prod --yes

echo ""
echo "✅ Deployment process completed!"
echo ""
echo "📝 Next steps:"
echo "1. Deploy backend to Railway: https://railway.app/new"
echo "2. Add MongoDB database in Railway"
echo "3. Set environment variables"
echo "4. Update VITE_API_URL in Vercel with your Railway backend URL"


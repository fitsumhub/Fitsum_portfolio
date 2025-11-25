# Automated Deployment Script for Fitsum Portfolio
Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Cyan

# Step 1: Build Frontend
Write-Host "`n📦 Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green

# Step 2: Check if Vercel CLI is available
Write-Host "`n🔍 Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "📥 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Step 3: Deploy to Vercel
Write-Host "`n🌐 Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "Please login to Vercel when prompted..." -ForegroundColor Cyan
npx vercel --prod --yes

Write-Host "`n✅ Deployment process completed!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy backend to Railway: https://railway.app/new" -ForegroundColor White
Write-Host "2. Add MongoDB database in Railway" -ForegroundColor White
Write-Host "3. Set environment variables" -ForegroundColor White
Write-Host "4. Update VITE_API_URL in Vercel with your Railway backend URL" -ForegroundColor White


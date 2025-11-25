@echo off
echo Starting Fitsum Portfolio Backend Server...
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/fitsum_portfolio
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
        echo JWT_EXPIRES_IN=7d
        echo UPLOAD_DIR=./uploads
    ) > .env
    echo .env file created!
    echo.
)

echo Starting server...
echo.
node server.js


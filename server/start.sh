#!/bin/bash

echo "Starting Fitsum Portfolio Backend Server..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitsum_portfolio
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
EOF
    echo ".env file created!"
    echo ""
fi

echo "Starting server..."
echo ""
node server.js


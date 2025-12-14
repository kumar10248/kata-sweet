#!/bin/bash

echo "🚀 Starting deployment build..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install --production=false

# Build frontend
echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build

echo "✅ Deployment build complete!"

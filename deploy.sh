#!/bin/bash
# deploy.sh — Automation script for redeploying timeless-wedding on the production server
set -e

echo "📥 Pulling latest changes from Git..."
git pull origin react-v1

echo "📦 Installing dependencies..."
# Ensure devDependencies (like Vite) are installed for building the frontend
npm install --include=dev

echo "🔧 Running database migrations..."
NODE_ENV=production npm run migrate

echo "🏗️  Building frontend..."
npm run build

echo "🔄 Restarting PM2 backend process..."
NODE_ENV=production pm2 restart timeless-wedding-api-14888

echo "✅ Deploy complete successfully!"

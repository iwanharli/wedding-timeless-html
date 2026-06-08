#!/bin/bash
# deploy.sh — Automation script for redeploying timeless-wedding on the production server
set -e

# Force production environment for migrations and build process
export NODE_ENV=production

echo "📥 Pulling latest changes from Git..."
git pull origin react-v1

echo "📦 Installing dependencies..."
npm install

echo "🔧 Running database migrations..."
npm run migrate

echo "🏗️  Building frontend..."
npm run build

echo "🔄 Restarting PM2 backend process..."
pm2 restart wedding-api

echo "✅ Deploy complete successfully!"

#!/bin/bash
# deploy.sh — Automation script for redeploying timeless-wedding on the production server
set -e

# Load NVM to ensure correct Node version (v22+) is used
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    nvm use default || true
fi

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
NODE_ENV=production pm2 restart timeless-wedding-api-14888 --update-env

echo "✅ Deploy complete successfully!"

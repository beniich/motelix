#!/bin/bash
# Zafir — Deploy script (subsequent updates)
# Usage: sudo bash deploy.sh [branch]
set -euo pipefail

BRANCH="${1:-main}"
APP_DIR="/opt/zafir/repo"
APP_USER="zafir"

echo "🚀 Deploying branch: ${BRANCH}"
cd "${APP_DIR}"

sudo -u "${APP_USER}" git fetch origin
sudo -u "${APP_USER}" git checkout "${BRANCH}"
sudo -u "${APP_USER}" git pull origin "${BRANCH}"

echo "📦 Building backend..."
cd backend
sudo -u "${APP_USER}" npm ci --omit=dev
sudo -u "${APP_USER}" npx prisma generate
sudo -u "${APP_USER}" npx prisma db push --skip-generate
sudo -u "${APP_USER}" npm run build
echo "🔄 Restarting backend..."
systemctl restart zafir-backend

echo "📦 Building frontend..."
cd "${APP_DIR}"
sudo -u "${APP_USER}" npm ci
sudo -u "${APP_USER}" npm run build

echo "🔄 Reloading Nginx..."
nginx -t && systemctl reload nginx

echo "✅ Deploy complete! Backend restarted, frontend static files updated."

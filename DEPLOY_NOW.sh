#!/bin/bash

# Talaritel - Deploy to Vercel
# This script prepares and deploys your project to Vercel

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   TALARITEL - VERCEL DEPLOYMENT SCRIPT                       ║"
echo "║   International Telecom Platform with Ethiopian Theme         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
  echo "❌ Error: Not a git repository"
  echo "Please run: git init"
  exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "⚠️  .env.local not found"
  echo "Creating from .env.example..."
  cp .env.example .env.local
  echo "✅ Created .env.local"
  echo "📝 Please edit .env.local with your Supabase credentials"
  exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
  echo "❌ npm install failed"
  exit 1
fi
echo "✅ Dependencies installed"

# Build the project
echo ""
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi
echo "✅ Build successful"

# Add all files to git
echo ""
echo "📤 Preparing for deployment..."
git add -A
git commit -m "feat: Deploy Talaritel to Vercel - Full backend/frontend with Ethiopian theme"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main
if [ $? -ne 0 ]; then
  echo "❌ Git push failed"
  exit 1
fi
echo "✅ Pushed to GitHub"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   DEPLOYMENT READY!                                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'New Project'"
echo "3. Import 'personal_demo_class_project' from GitHub"
echo "4. Add Environment Variables:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "5. Click 'Deploy'"
echo ""
echo "Your app will be live in ~2-5 minutes!"
echo ""

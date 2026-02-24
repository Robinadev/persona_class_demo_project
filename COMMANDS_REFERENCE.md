# Talaritel - Commands Reference

Quick copy-paste commands to get your project live.

## Phase 1: Local Setup

```bash
# Install all dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Start development server
npm run dev
```

## Phase 2: Database Setup

Copy each script to Supabase SQL Editor and run:

1. **Create Tables** (Script: `/scripts/01-create-tables.sql`)
   - Creates all 10 database tables
   - Wait for: "Success"

2. **Create Indexes** (Script: `/scripts/02-create-indexes.sql`)
   - Adds performance indexes
   - Wait for: "Success"

3. **Enable RLS** (Script: `/scripts/03-enable-rls.sql`)
   - Enables Row Level Security
   - Wait for: "Success"

## Phase 3: Testing

```bash
# Start dev server (if not running)
npm run dev

# Test these URLs in your browser:
# http://localhost:3000/landing
# http://localhost:3000/api/health
# http://localhost:3000/profile
# http://localhost:3000/billing
# http://localhost:3000/admin/dashboard
```

## Phase 4: Deployment

```bash
# Add all files to git
git add .

# Commit your changes
git commit -m "Talaritel: deployment ready"

# Push to GitHub
git push origin main
```

Then deploy on Vercel:
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Deploy"
5. Wait for build to complete
6. Your app is live!

## Build & Preview

```bash
# Build production bundle locally
npm run build

# Start production server locally
npm start

# Format code with Prettier
npm run format

# Run TypeScript check
npx tsc --noEmit

# Verify setup (runs checks)
node scripts/verify-setup.js
```

## Environment Variables

```bash
# Your environment is automatically configured via Vercel + Supabase integration
# Required variables (already set):
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional for admin:
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_hash_here
```

## Troubleshooting Commands

```bash
# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Clear Next.js cache
rm -rf .next

# Rebuild everything
npm run build

# Kill any process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Database Commands

```bash
# Test connection to Supabase
curl https://<your-project>.supabase.co/rest/v1/

# Check database tables exist
# Go to: https://supabase.com/dashboard
# → SQL Editor
# → Run: SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

## Monitoring

```bash
# View live development logs
npm run dev

# View production logs
# https://vercel.com/dashboard → Select project → Deployments → View logs

# View Supabase logs
# https://supabase.com/dashboard → Select project → Logs

# Local build analysis
npm run build -- --analyze
```

## Quick Tests

```bash
# Test landing page loads
curl http://localhost:3000/landing

# Test API health
curl http://localhost:3000/api/health

# Test API with data
curl -X POST http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User"}'

# View all files
find . -type f -name "*.tsx" -o -name "*.ts" | head -20
```

## Git Commands

```bash
# Check git status
git status

# View recent commits
git log --oneline -5

# Create new branch for feature
git checkout -b feature/new-feature

# Merge to main
git checkout main
git merge feature/new-feature

# Push specific branch
git push origin feature/new-feature

# View all branches
git branch -a
```

## Dependencies Management

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update package-name

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# View installed versions
npm list
```

## Performance Optimization

```bash
# Analyze bundle size
npm run build
npx next-bundle-analyzer

# Generate performance report
npm run build -- --profile
```

---

## QUICK COPY-PASTE FOR DEPLOYMENT

### Step 1: Setup
```bash
npm install
cp .env.example .env.local
```

### Step 2: Run Database Scripts
Copy and run in Supabase SQL Editor:
- `/scripts/01-create-tables.sql`
- `/scripts/02-create-indexes.sql`
- `/scripts/03-enable-rls.sql`

### Step 3: Test
```bash
npm run dev
# Visit http://localhost:3000/landing
# Check http://localhost:3000/api/health
```

### Step 4: Deploy
```bash
git add .
git commit -m "Deployment ready"
git push origin main
# Go to https://vercel.com/dashboard
# Click "New Project" → Select repo → "Deploy"
```

---

Done! Your app is live in 15 minutes. 🚀

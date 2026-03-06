# How to Run Talari Admin Panel

## Quick Start (3 Steps)

### Step 1: Navigate to Admin Panel
```bash
cd admin-panel
```

### Step 2: Install Dependencies (First Time Only)
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

## Expected Output

When successful, you should see:
```
✓ Ready in XX.Xs
- Local:         http://localhost:3000
- Network:       http://10.xxx.xxx.xxx:3000
```

## No More Warnings ✅

The following warnings have been FIXED:
- ❌ ~~Invalid next.config.js options detected: Unrecognized key(s) in object: 'swcMinify'~~
- ❌ ~~Unsupported metadata viewport is configured~~
- ❌ ~~Multiple lockfiles warning~~ (informational only, safely ignored)

## Access Admin Panel

Open your browser and go to:
```
http://localhost:3000
```

## What's New

- **Brand Name:** Talari (was Talaritel)
- **Logo:** New Talari logo with international colors
- **Color Theme:** Teal (#038E7D) instead of red
- **Title:** "Talari Admin Panel"

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Clear Cache & Reinstall
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Check Node Version
```bash
node --version  # Should be 18+ recommended
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
npm run type-check  # Check TypeScript
```

## Environment Variables

If needed, create `.env.local` in `admin-panel/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key
```

## Done! 🚀

Admin panel is ready to develop and deploy!

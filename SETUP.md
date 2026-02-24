# Talaritel Setup & Troubleshooting Guide

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Settings
NEXT_PUBLIC_APP_NAME=Talaritel
NODE_ENV=development
```

### 3. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com)
2. Create or select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Public API Key (anon, public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Secret Key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Set Up Database Schema

**Option A: Automatic (Recommended)**
- The app will attempt to initialize the schema on first run
- Check `/api/health` endpoint to verify database status

**Option B: Manual Setup**
1. Open Supabase Dashboard → SQL Editor
2. Create a new query and paste the contents of `scripts/01-create-tables.sql`
3. Execute the query
4. Repeat for `scripts/02-create-indexes.sql`
5. Repeat for `scripts/03-enable-rls.sql`

### 5. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## Testing Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": "healthy",
    "api": "healthy"
  }
}
```

### User Profile
```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Issues & Solutions

### Issue: "Missing Supabase credentials"

**Problem:** Error message about missing SUPABASE_URL or SUPABASE_KEY

**Solution:**
1. Check `.env.local` file exists
2. Verify all three Supabase variables are present
3. Ensure no spaces or quotes around values
4. Restart dev server after updating `.env.local`

```bash
# Verify env variables are loaded
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Issue: "Database connection refused"

**Problem:** Cannot connect to Supabase database

**Solution:**
1. Verify Supabase project is active (not paused)
2. Check internet connection
3. Verify credentials are correct
4. Try accessing Supabase dashboard directly
5. Check firewall/VPN restrictions

```bash
# Test database connection
curl http://localhost:3000/api/health
```

### Issue: "Table does not exist"

**Problem:** Error message about missing tables

**Solution:**
1. Run migration scripts manually (see "Set Up Database Schema" above)
2. Verify RLS policies are enabled
3. Check that service role key has proper permissions

**Verify tables exist:**
1. Open Supabase Dashboard
2. Go to Table Editor
3. Look for: `profiles`, `wallets`, `transactions`, `calls`, `contacts`, `transfers`, `plans`, `subscriptions`, `activity_logs`

### Issue: "Authentication failed"

**Problem:** Login/signup not working

**Solution:**
1. Ensure Supabase Auth is enabled
2. Check user exists in auth.users
3. Verify RLS policies for profiles table
4. Clear browser cookies and try again

```sql
-- Check if user exists in Supabase
SELECT id, email FROM auth.users LIMIT 5;
```

### Issue: "API returns 401 Unauthorized"

**Problem:** All API requests return 401

**Solution:**
1. Check that session cookie is being set
2. Verify auth flow is complete
3. Check middleware.ts allows API routes
4. Try accessing `/api/health` (doesn't require auth)

### Issue: "Styling not applied (Tailwind CSS not working)"

**Problem:** Pages look unstyled

**Solution:**
1. Ensure `tailwind.config.js` exists
2. Check `globals.css` has `@tailwind` directives
3. Rebuild the project:
   ```bash
   npm run build
   ```
4. Clear `.next` folder and rebuild:
   ```bash
   rm -rf .next
   npm run build
   ```

### Issue: "TypeScript errors in imports"

**Problem:** Red squiggly lines under imports

**Solution:**
1. Ensure `tsconfig.json` has correct paths
2. Restart TypeScript server in IDE
3. Run type check:
   ```bash
   npx tsc --noEmit
   ```

### Issue: "Sonner toast notifications not showing"

**Problem:** Toast messages don't appear

**Solution:**
1. Verify `<Toaster />` is in layout.tsx
2. Check imports: `import { toast } from 'sonner'`
3. Verify `sonner` package is installed:
   ```bash
   npm list sonner
   ```

## Database Schema Overview

### Core Tables

**profiles**
- Stores user profile information
- Fields: id, email, full_name, phone_number, avatar_url, created_at, updated_at

**wallets**
- Stores user wallet and balance
- Fields: id, user_id, balance, currency, created_at, updated_at

**transactions**
- Logs all financial transactions
- Fields: id, user_id, amount, type, status, description, created_at

**calls**
- Logs call history
- Fields: id, user_id, phone_number, call_type, call_status, duration_seconds, cost, created_at

**contacts**
- User contact list
- Fields: id, user_id, name, phone_number, email, notes, is_favorite, created_at

**transfers**
- Money transfer history
- Fields: id, sender_id, recipient_id, amount, note, status, created_at

**plans**
- Subscription plans
- Fields: id, name, price, minutes, description, is_active, created_at

**subscriptions**
- User subscriptions
- Fields: id, user_id, plan_id, status, expires_at, created_at

**activity_logs**
- System activity logging
- Fields: id, user_id, action, resource_type, resource_id, created_at

**admin_users**
- Admin user accounts
- Fields: id, email, password_hash, is_active, role, created_at, updated_at

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrations executed in Supabase
- [ ] RLS policies enabled on all tables
- [ ] Authentication configured
- [ ] Admin users created
- [ ] Testing completed on staging
- [ ] Error logs monitored

## Performance Tips

1. Enable database query caching
2. Use Next.js Image component for images
3. Implement pagination for large data sets
4. Monitor API response times
5. Use SWR for client-side data fetching

## Security Checklist

- [ ] Environment variables not in git
- [ ] RLS policies properly configured
- [ ] API routes require authentication
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] CORS properly configured
- [ ] Admin routes protected

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Report bugs here
- **Discord Community**: Get help from community

## Additional Notes

- The app uses the Ethiopian flag colors (red, gold, green) for branding
- All currency is in ETB (Ethiopian Birr)
- Phone validation follows Ethiopian format (+251 or 0 prefix)
- The system includes role-based access control for admins

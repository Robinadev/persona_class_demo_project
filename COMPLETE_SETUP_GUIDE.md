# Talateri - Complete Multi-Platform Setup Guide

This guide covers setting up and running all three applications: Backend API, React Native Mobile App, and Web Admin Panel.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Supabase Database                    │
│           (PostgreSQL with RLS policies)                │
└─────────────────────────────────────────────────────────┘
         ↑                    ↑                    ↑
         │                    │                    │
    ┌────────────┐      ┌──────────────┐    ┌─────────────┐
    │  Mobile    │      │   Backend    │    │ Admin Panel │
    │   App      │      │   API        │    │  (Web)      │
    │(React Native)     │ (Express)    │    │ (Next.js)   │
    │ iOS/Android│      │ Port 3001    │    │ Port 3000   │
    └────────────┘      └──────────────┘    └─────────────┘
```

## Prerequisites

- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Git** - Version control
- **Expo CLI** - For React Native: `npm install -g expo-cli`
- **Supabase Account** - [Sign up free](https://supabase.com)
- **Vercel Account** (optional) - For deployments

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project in your desired region
3. Note your credentials:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon Key: `eyJhbGciOiJSUzI1NiIs...`
   - Service Role Key: (get from Settings → API)

### 1.2 Run Migrations

All database migrations are in `/supabase/migrations/`:

1. Use Supabase Dashboard SQL Editor:
   - Open your Supabase project
   - Go to SQL Editor
   - Run each migration file in order:
     ```
     1. 20260220200118_create_users_and_profiles.sql
     2. 20260220200239_create_admin_and_activity_logs.sql
     3. 20260225_comprehensive_rbac_schema.sql
     ```

2. Or use Supabase CLI:
   ```bash
   supabase db push
   ```

## Step 2: Backend API Setup (Node.js/Express)

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment

Create `.env` file in `backend/`:

```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRY=7d

CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:19000,exp://localhost:19000
```

### 2.3 Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3001`

### 2.4 Test Backend

```bash
curl http://localhost:3001/api/health
# Expected response: {"status":"healthy","database":"connected"}
```

## Step 3: React Native Mobile App Setup

### 3.1 Install Dependencies

```bash
cd mobile
npm install
```

### 3.2 Configure Environment

Update `mobile/app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3001/api",
      "supabaseUrl": "https://xxxxx.supabase.co",
      "supabaseKey": "your_anon_key_here"
    }
  }
}
```

### 3.3 Start Expo Development Server

```bash
npm start
```

This shows a QR code. Scan with:
- **Android**: Expo Go app (Google Play)
- **iOS**: Camera app → Opens in Expo Go

### 3.4 Run on Simulators

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

## Step 4: Web Admin Panel Setup

### 4.1 Install Dependencies

```bash
cd admin-panel
npm install
```

### 4.2 Configure Environment

Create `.env.local` in `admin-panel/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your_anon_key_here
```

### 4.3 Start Development Server

```bash
npm run dev
```

Admin panel will run on `http://localhost:3000`

## Step 5: Test All Systems

### 5.1 Create Test Accounts

Using the mobile app or admin panel signup:

1. **Super Admin** (for system management)
   - Email: `admin@talateri.com`
   - Password: `TestPass123!`
   - Role: Super Admin

2. **Admin** (for user management)
   - Email: `manager@talateri.com`
   - Password: `TestPass123!`
   - Role: Admin

3. **Support** (for customer support)
   - Email: `support@talateri.com`
   - Password: `TestPass123!`
   - Role: Support

4. **Regular User**
   - Email: `user@talateri.com`
   - Password: `TestPass123!`
   - Role: User

### 5.2 Test Authentication Flow

1. Login with different roles in mobile app
2. Verify you see role-specific dashboards
3. Try accessing other role dashboards (should redirect)
4. Test logout and login again

### 5.3 Test Admin Panel

1. Go to `http://localhost:3000`
2. Login with super admin credentials
3. Test user management:
   - Filter users by role
   - Search users
   - Change user roles
   - Deactivate users
4. Check dashboard stats and charts

### 5.4 Test Real-time Updates

1. Create a transaction in mobile app
2. Instantly see it in admin panel
3. Verify it appears in both places

## Step 6: Production Deployment

### Deploy Backend to Railway/Render

**Option A: Railway.app**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize and deploy
railway init
railway up
```

**Option B: Render.com**

1. Connect GitHub repo
2. Create new Web Service
3. Set environment variables
4. Deploy

### Deploy Mobile App

**Build and Submit to App Stores**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Deploy Admin Panel to Vercel

```bash
# Option 1: Via Vercel CLI
npm install -g vercel
vercel

# Option 2: Via GitHub
# Connect repo to Vercel dashboard and auto-deploy
```

## Step 7: Environment Variables Summary

### Backend (backend/.env)
```
PORT
NODE_ENV
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
JWT_EXPIRY
CORS_ORIGIN
```

### Mobile (mobile/app.json)
```
apiUrl
supabaseUrl
supabaseKey
```

### Admin Panel (admin-panel/.env.local)
```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_KEY
```

## Troubleshooting

### Backend Connection Issues
- Ensure Supabase credentials are correct
- Check CORS_ORIGIN matches your app URLs
- Verify JWT_SECRET is set

### Mobile App Issues
- Clear cache: `expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check API_URL in app.json matches backend

### Admin Panel Issues
- Clear Next.js cache: `rm -rf .next`
- Ensure API URL is correct in .env.local
- Check localStorage permissions

## API Documentation

All API routes require JWT authorization (Bearer token):

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/users/me
```

### Key Endpoints

**Auth:**
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Create account
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

**Users:**
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users` - List users (admin only)
- `PUT /api/users/:id/role` - Change role (super admin only)

**Transactions:**
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions/transfer` - Send transfer
- `POST /api/transactions/topup` - Topup wallet

**Analytics:**
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/transaction-trends` - Trends

## File Structure

```
talateri-project/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth, error handling
│   │   ├── lib/              # Utilities
│   │   └── index.ts          # Server entry
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── mobile/                     # React Native (Expo)
│   ├── app/
│   │   ├── navigation/        # Screen navigation
│   │   ├── screens/           # App screens
│   │   ├── context/           # Auth context
│   │   ├── services/          # API client
│   │   └── App.tsx
│   ├── app.json              # Expo config
│   └── package.json
│
├── admin-panel/               # Next.js Admin
│   ├── app/
│   │   ├── dashboard/        # Main dashboard
│   │   ├── users/            # Users management
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   └── auth-store.ts    # State management
│   ├── components/           # Shared components
│   ├── package.json
│   └── .env.local
│
├── supabase/
│   └── migrations/            # Database migrations
│
└── README.md
```

## Support & Resources

- **Backend Docs**: Express.js, Axios, Supabase
- **Mobile Docs**: Expo, React Native, React Navigation
- **Admin Panel Docs**: Next.js, Tailwind CSS, Recharts
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase WebSockets

## Security Notes

- Always use strong JWT_SECRET in production
- Never commit `.env` files
- Use HTTPS in production
- Enable RLS policies (done in migrations)
- Rotate tokens periodically
- Keep dependencies updated

## Next Steps

1. Test all three applications locally
2. Create additional screens as needed
3. Implement offline caching for mobile
4. Add push notifications
5. Set up CI/CD pipelines
6. Deploy to production
7. Monitor usage and performance

---

**Last Updated**: February 2026
**Version**: 1.0.0

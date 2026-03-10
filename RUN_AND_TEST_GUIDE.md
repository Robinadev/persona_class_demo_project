# Talari Applications - Run & Test Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- Supabase project configured with all env vars set

---

## Web App (Talari Web App)

### Setup
```bash
# Install dependencies
npm install

# Ensure all env vars are set
echo "Check .env.local for NEXT_PUBLIC_SUPABASE_URL, etc."
```

### Run
```bash
# Start development server
npm run dev

# App opens at http://localhost:3000
```

### Test Signup Flow
1. Navigate to http://localhost:3000/signup
2. Enter test data:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: 5551234567 (USA format)
3. Accept terms and click "Send Verification Code"
4. Use the OTP from console logs
5. Click "Create Account"

### Test Login Flow
1. Navigate to http://localhost:3000/login
2. Enter phone: 5551234567
3. Click "Send Verification Code"
4. Enter OTP code
5. Should redirect to home page

### Test Support Page
- Navigate to http://localhost:3000/support
- Verify email button opens mail client
- Verify FAQ content displays

### Test 404 Page
- Navigate to http://localhost:3000/nonexistent
- Should show professional 404 page with navigation options

---

## Admin Panel (Talari Admin)

### Setup
```bash
cd admin-panel
npm install
npm run dev

# Admin panel opens at http://localhost:3001 (or next available port)
```

### Test Dashboard
1. Admin panel should load without authentication (for now)
2. Dashboard shows:
   - Total Users count
   - Active Users (24h)
   - Total Calls
   - Total Revenue
3. Click "Refresh" button to update stats
4. Charts display activity data

### Test Real-Time Updates
1. Leave dashboard open
2. Stats refresh every 60 seconds automatically
3. Check "Last updated" timestamp

### Test Admin 404 Page
1. Navigate to `/admin-panel/nonexistent`
2. Should show admin 404 page
3. Links should navigate to dashboard or users

---

## Mobile App (Talari Mobile)

### Setup
```bash
cd mobile
npm install
npx expo install

# Set up Expo Go app on phone or emulator
```

### Run
```bash
# Start Expo development server
npx expo start

# Scan QR code with Expo Go app on phone
# Or press 'a' for Android emulator, 'i' for iOS simulator
```

### Test Signup Flow
1. App starts at landing screen
2. Click "Create Account"
3. Go through signup steps (same as web)
4. Should redirect to home/dashboard

### Test Login Flow
1. From landing, click "Login"
2. Enter phone number
3. Verify with OTP
4. Should authenticate

### Test All Screens
- Call: Verify dialpad interface
- Contacts: Test add/edit contacts
- Plans: View subscription options
- Topup: Test balance recharge UI
- Profile: View user information
- Settings: Adjust preferences

---

## API Testing

### Using cURL

#### Test Send OTP
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"5551234567"}'
```

#### Test Verify OTP
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+15551234567","code":"123456"}'
```

#### Test Create Account
```bash
curl -X POST http://localhost:3000/api/auth/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@example.com",
    "phoneNumber":"+15551234567",
    "verificationCode":"123456"
  }'
```

#### Test Admin Dashboard Stats
```bash
curl http://localhost:3000/api/admin/dashboard-stats
```

---

## Database Setup (Supabase)

### Required Tables
Ensure these tables exist in your Supabase project:

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user',
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### otp_codes
```sql
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  code TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_used BOOLEAN DEFAULT false,
  attempt_count INT DEFAULT 0,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### sessions
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## Environment Variables Required

### Web App (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
JWT_SECRET=your_jwt_secret_key
```

### Admin Panel (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Mobile App (.env)
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Troubleshooting

### OTP Code Not Sending
- Check console logs for OTP code
- Verify Supabase connection
- Ensure phone number format is correct (USA)

### Account Creation Fails
- Verify phone was properly verified via OTP
- Check database has users table
- Ensure JWT_SECRET is set

### Admin Dashboard Shows No Data
- Verify call_logs table exists
- Check users table has data
- Ensure API endpoint is accessible

### Mobile App Crashes on Login
- Clear app cache
- Verify environment variables in .env
- Check Supabase credentials
- Reinstall dependencies: `npm install`

---

## Production Build

### Web App
```bash
npm run build
npm run start
```

### Admin Panel
```bash
cd admin-panel
npm run build
npm run start
```

### Mobile App
```bash
cd mobile
npx eas build --platform all
npx eas submit --platform all
```

---

## Performance Tips

1. **Web App**: Use `next/image` for images, implement lazy loading
2. **Admin**: Dashboard stats cached locally, refresh every 60s
3. **Mobile**: Offline support, use AsyncStorage for temp data
4. **Database**: Add indexes on frequently queried columns

---

## Security Checklist

Before production deployment:
- [ ] Change JWT_SECRET to strong random value
- [ ] Set up rate limiting on OTP endpoints
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Configure CORS properly
- [ ] Use HTTPS only
- [ ] Set up monitoring and logging
- [ ] Configure email/SMS provider credentials
- [ ] Enable database backups

---

## Support

If you encounter issues:
1. Check browser console for error messages
2. Review server logs for API errors
3. Verify Supabase connection and credentials
4. Check that all required tables exist
5. Ensure environment variables are set correctly

For help: support@talari.com

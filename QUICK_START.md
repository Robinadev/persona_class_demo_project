# Quick Start Guide - International Calling App

Get up and running with SMS OTP authentication and real-time sync in 5 minutes.

## Prerequisites

- Supabase project created and connected
- Environment variables configured
- Node.js 18+ installed
- React Native/Expo for mobile app

## Step 1: Setup Environment Variables (2 min)

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_super_secret_jwt_key_32_chars_min
```

For mobile app, update `mobile/app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3000/api",
      "supabaseUrl": "your_supabase_url",
      "supabaseKey": "your_anon_key"
    }
  }
}
```

## Step 2: Verify Database Setup (1 min)

Database migration already executed. Verify by checking Supabase dashboard:

Tables created:
- ✅ `users` - User accounts
- ✅ `otp_codes` - Verification codes
- ✅ `sessions` - Auth sessions
- ✅ `sync_events` - Real-time events
- ✅ `call_logs` - Call history
- ✅ `device_info` - Device data
- ✅ `user_settings` - Preferences

## Step 3: Start Development (1 min)

### Web App
```bash
npm run dev
# Opens http://localhost:3000
```

### Mobile App
```bash
cd mobile
npx expo start
# Scan QR code with Expo Go app
```

## Step 4: Test SMS OTP Flow (1.5 min)

### Web App Login
1. Go to http://localhost:3000/login
2. Enter USA phone: `5551234567` or `+1 (555) 123-4567`
3. Click "Send Verification Code"
4. **Check browser console for OTP code** (logged in dev mode)
5. Enter 6-digit code
6. Click "Log In"
7. Redirects to home - **Success!**

### Mobile App Login
1. Launch mobile app
2. Enter phone: `5551234567`
3. Tap "Send Verification Code"
4. **Check console for OTP code**
5. Enter 6-digit code
6. Tap "Verify & Login"
7. Navigates to main app - **Success!**

## Step 5: Test Real-Time Sync (1.5 min)

### From Web App
```javascript
// Open browser console (F12)
import RealTimeSync from "@/lib/sync-service";

const userId = localStorage.getItem("user_id");
const sync = new RealTimeSync(userId);

await sync.logCall({
  recipientPhoneNumber: "+15559876543",
  duration: 300,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  status: "completed"
});

console.log("Check Supabase dashboard - sync_events table");
```

### From Mobile App (React Native)
```typescript
import MobileRealTimeSync from '@/services/sync';

const userId = await AsyncStorage.getItem('user_id');
const sync = new MobileRealTimeSync(userId);

await sync.logCall({
  recipientPhoneNumber: "+15559876543",
  duration: 300,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  status: "completed"
});

// Event queued and synced when online
```

## Color Theme

All UI uses **International Teal Theme**:
- Primary: `#038E7D` (Teal)
- Hover: `#026B5E` (Dark Teal)
- Active: `#015248` (Darkest Teal)
- Background: `#FFFFFF`
- Secondary: `#E0F5F2` (Light Teal)

Theme is consistent across:
- ✅ Web app
- ✅ Mobile app
- ✅ Admin panel
- ✅ All buttons/links

## API Endpoints Reference

### OTP Authentication
```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "5551234567"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+15551234567", "code": "123456"}'

# Resend OTP
curl -X POST http://localhost:3000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+15551234567"}'
```

### Real-Time Sync
```bash
# Create sync event
curl -X POST http://localhost:3000/api/sync/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "eventType": "call_log",
    "data": {"recipientPhoneNumber": "+15559876543", "duration": 120}
  }'

# Get sync events
curl -X GET http://localhost:3000/api/sync/events \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update event status
curl -X PATCH http://localhost:3000/api/sync/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"eventId": "event-id", "status": "synced"}'
```

## Key Files

### Authentication
- `app/api/auth/send-otp/route.ts` - Send SMS code
- `app/api/auth/verify-otp/route.ts` - Verify code
- `app/login/page.tsx` - Web login UI
- `mobile/app/screens/auth/LoginScreen.tsx` - Mobile login

### Sync System
- `lib/sync-service.ts` - Web sync service
- `mobile/app/services/sync.ts` - Mobile sync service
- `app/api/sync/events/route.ts` - Sync API endpoint

### Utilities
- `lib/phone-utils.ts` - Phone validation & formatting

## Common Tasks

### Validate Phone Number
```typescript
import { validateAndNormalizePhone } from "@/lib/phone-utils";

validateAndNormalizePhone("5551234567")
// Returns: "+15551234567"

validateAndNormalizePhone("+1 (555) 123-4567")
// Returns: "+15551234567"
```

### Format Phone for Display
```typescript
import { formatPhoneForDisplay, maskPhone } from "@/lib/phone-utils";

formatPhoneForDisplay("+15551234567")
// Returns: "(555) 123-4567"

maskPhone("+15551234567")
// Returns: "+1 555 ***-****"
```

### Queue Offline Event (Mobile)
```typescript
const sync = new MobileRealTimeSync(userId);

// Automatically queues if offline
await sync.updateUserProfile({
  name: "John Doe",
  avatar_url: "https://..."
});

// Auto-syncs when online
```

## Troubleshooting

### "OTP Code Not Found"
1. Check browser console for logged OTP
2. Code expires in 10 minutes
3. Max 5 attempts per code

### "Phone Number Invalid"
1. Must be USA number
2. Remove special characters
3. Use 10 digits or with +1

### "Supabase Error"
1. Check `.env.local` variables
2. Verify Supabase project is active
3. Check database tables exist

### "Sync Not Working"
1. Verify user is logged in
2. Check JWT token exists
3. Ensure internet connection
4. Review Supabase dashboard

## Next Steps

1. **Integrate SMS Provider** - Update `sendSMS()` in send-otp endpoint
2. **Add Call Features** - Implement calling screen
3. **Build Admin Dashboard** - Monitor user activity
4. **Setup Notifications** - Real-time call alerts
5. **Production Deployment** - Set JWT_SECRET, enable RLS

## Testing Checklist

- [ ] Web login with OTP
- [ ] Mobile login with OTP
- [ ] Resend OTP code
- [ ] Real-time sync events
- [ ] Phone number validation
- [ ] Teal color theme visible
- [ ] Responsive on mobile
- [ ] Offline queue and sync
- [ ] Admin sync event viewing

## Useful Commands

```bash
# Web app
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter

# Mobile app
cd mobile
npx expo start       # Start development
npx expo build       # Build for iOS/Android
npx expo prebuild    # Prebuild native code

# Database
# Visit: https://app.supabase.com
# Click "SQL Editor" to run queries
```

## File Structure

```
├── app/
│   ├── api/auth/              # OTP endpoints
│   ├── api/sync/              # Sync endpoints
│   ├── login/page.tsx         # Web login
│   └── signup/page.tsx        # Web signup
├── mobile/
│   └── app/screens/auth/      # Mobile auth
├── lib/
│   ├── phone-utils.ts         # Phone helpers
│   └── sync-service.ts        # Web sync
└── scripts/
    └── 01-create-otp-table.sql # DB migrations
```

## Documentation

- **Full Guide:** See `IMPLEMENTATION_GUIDE.md`
- **All Changes:** See `CHANGES_SUMMARY.md`
- **This Guide:** `QUICK_START.md`

---

**You're ready!** 

Now test the OTP flow, then integrate your SMS provider for production. See `IMPLEMENTATION_GUIDE.md` for detailed instructions.

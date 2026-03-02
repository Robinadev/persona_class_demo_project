# International Calling App - Implementation Guide

## Overview
This guide covers the unified implementation of the web app, mobile app, and backend API with international calling standards (teal color theme), SMS OTP verification, and real-time sync capabilities.

## Project Structure

```
├── app/                          # Next.js Web App
│   ├── api/                      # Backend APIs
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── send-otp/        # SMS OTP generation
│   │   │   ├── verify-otp/      # OTP verification & login
│   │   │   └── resend-otp/      # Resend OTP code
│   │   └── sync/                # Real-time sync endpoints
│   │       └── events/          # Sync event management
│   ├── login/                    # Login page (web)
│   ├── signup/                   # Signup page (web)
│   └── call/                     # Calling interface (web)
├── mobile/                       # React Native Mobile App
│   └── app/
│       ├── screens/             # Mobile screens
│       │   └── auth/
│       │       └── LoginScreen.tsx  # Mobile OTP login
│       ├── services/            # Mobile services
│       │   ├── api.ts           # API client
│       │   └── sync.ts          # Real-time sync
│       └── config/
│           └── constants.ts     # Theme colors & config
├── admin-panel/                 # Admin Dashboard
├── backend/                     # Express.js Backend (optional)
├── lib/                         # Shared utilities
│   ├── phone-utils.ts          # Phone validation/formatting
│   └── sync-service.ts         # Web sync service
└── scripts/                     # Database migrations
    └── 01-create-otp-table.sql # OTP tables setup
```

## Environment Variables Setup

### Web App (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_change_in_production
```

### Mobile App (app.json)
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3000/api",
      "supabaseUrl": "your_supabase_url",
      "supabaseKey": "your_supabase_anon_key"
    }
  }
}
```

## Color System

### Primary Colors
- **Primary Teal**: #038E7D (International standard)
- **Primary Hover**: #026B5E (Darker shade for hover)
- **Primary Active**: #015248 (Darkest for active state)

### Neutral Colors
- **Background**: #FFFFFF
- **Foreground**: #1F2937
- **Muted**: #6B7280
- **Light Teal Background**: #E0F5F2

All color values are defined in:
- Web: `app/globals.css` and `styles/globals.css`
- Mobile: `mobile/app/config/constants.ts`
- Admin: `admin-panel/styles/globals.css`

## Key Features Implemented

### 1. SMS OTP Verification
**Location**: `app/api/auth/`

Features:
- USA phone number validation (E.164 format)
- 6-digit OTP generation
- 10-minute expiration
- Rate limiting (3 attempts per 5 minutes)
- Attempt tracking

**API Endpoints**:
- `POST /api/auth/send-otp` - Send verification code
- `POST /api/auth/verify-otp` - Verify code and create session
- `POST /api/auth/resend-otp` - Resend code

**Phone Validation**:
Accepts:
- 5551234567 (10 digits)
- (555) 123-4567 (formatted)
- +1 555 123 4567 (E.164)
- +15551234567 (E.164 compact)

### 2. Real-Time Sync System

**Web Service**: `lib/sync-service.ts`
- Supabase real-time subscriptions
- Offline queue with localStorage fallback
- Automatic sync when reconnected

**Mobile Service**: `mobile/app/services/sync.ts`
- AsyncStorage for offline queue
- Network listener for connectivity
- Automatic retry on reconnect

**Sync Events**:
- `call_log` - Call history
- `user_update` - Profile changes
- `device_update` - Device information
- `settings_change` - User settings

**API Endpoint**: `POST /api/sync/events`
- Create sync events
- Retrieve sync history
- Update sync status

### 3. Database Schema

Created tables via migration:
- `users` - User accounts
- `otp_codes` - OTP verification codes
- `sessions` - User sessions
- `sync_events` - Real-time sync events
- `call_logs` - Call history
- `device_info` - Device information
- `user_settings` - User preferences

### 4. Web App UI Updates

**Login Screen** (`app/login/page.tsx`):
- Phone number input with validation
- OTP code verification (6 digits)
- Resend functionality
- Error handling with user feedback
- Loading states
- Responsive design

**Signup Screen** (`app/signup/page.tsx`):
- Multi-step process (phone → OTP → details → confirm)
- Teal color theme throughout
- Input validation
- Error messages

### 5. Mobile App UI Updates

**Login Screen** (`mobile/app/screens/auth/LoginScreen.tsx`):
- Phone number input
- OTP verification flow
- Real-time expiry countdown
- Resend option
- Switch phone number option
- Matches web app styling with teal theme
- Touch-optimized UI

## Usage Examples

### Web App - Send OTP
```typescript
const response = await fetch("/api/auth/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phoneNumber: "+15551234567" })
});
```

### Web App - Verify OTP
```typescript
const response = await fetch("/api/auth/verify-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumber: "+15551234567",
    code: "123456"
  })
});
```

### Web App - Real-Time Sync
```typescript
import RealTimeSync from "@/lib/sync-service";

const sync = new RealTimeSync(userId);

// Subscribe to updates
sync.subscribeToCallLogs((log) => {
  console.log("New call:", log);
});

// Queue event
await sync.logCall({
  recipientPhoneNumber: "+15559876543",
  duration: 300,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  status: "completed"
});
```

### Mobile App - OTP Login
```typescript
import { API_URL } from '../../config/constants';

// Send OTP
const sendResponse = await fetch(`${API_URL}/auth/send-otp`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phoneNumber })
});

// Verify OTP
const verifyResponse = await fetch(`${API_URL}/auth/verify-otp`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phoneNumber, code })
});
```

### Mobile App - Real-Time Sync
```typescript
import MobileRealTimeSync from '../../services/sync';

const sync = new MobileRealTimeSync(userId);

// Listen for sync status
sync.onSyncStatusChange((status) => {
  console.log(`${status.queuedEvents} events queued`);
  console.log(`Online: ${status.isOnline}`);
});

// Queue call log
await sync.logCall({
  recipientPhoneNumber: "+15559876543",
  duration: 300,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  status: "completed"
});
```

## Phone Utility Functions

Located in `lib/phone-utils.ts`:

```typescript
// Validate and normalize
validateAndNormalizePhone("+1 (555) 123-4567") 
// Returns: "+15551234567"

// Format for display
formatPhoneForDisplay("+15551234567")
// Returns: "(555) 123-4567"

// Mask for security
maskPhone("+15551234567")
// Returns: "+1 555 ***-****"

// Check if USA number
isValidUSAPhone("+15551234567")
// Returns: true
```

## Testing Checklist

### OTP System
- [ ] Send OTP to valid USA number
- [ ] Receive 6-digit code
- [ ] Verify correct code
- [ ] Reject incorrect code
- [ ] Enforce 10-minute expiry
- [ ] Rate limiting (3 attempts per 5 min)
- [ ] Resend functionality

### UI/UX
- [ ] All screens use teal color theme
- [ ] Mobile responsive on web
- [ ] Touch-friendly on mobile
- [ ] Hover effects match spec
- [ ] Loading states visible
- [ ] Error messages clear
- [ ] Accessibility (ARIA labels)

### Sync System
- [ ] Events queue offline
- [ ] Auto-sync when online
- [ ] Real-time subscription updates
- [ ] Device info persists
- [ ] Call logs sync correctly
- [ ] Settings apply across devices
- [ ] No duplicate syncs

### Cross-Platform
- [ ] Web and mobile use same API
- [ ] Admin sees mobile user updates
- [ ] Mobile receives admin changes
- [ ] Token refresh works
- [ ] Session persistence
- [ ] Logout clears data

## SMS Provider Integration

**Current**: Mock implementation (logs to console)

**To Enable SMS** (Twilio example):
```typescript
// In app/api/auth/send-otp/route.ts

import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(phoneNumber: string, otp: string) {
  return twilioClient.messages.create({
    body: `Your verification code is: ${otp}. Valid for 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
}
```

## Production Checklist

- [ ] Set `JWT_SECRET` to strong random string
- [ ] Enable HTTPS for all API calls
- [ ] Configure CORS properly
- [ ] Setup SMS provider (Twilio/Vonage/AWS SNS)
- [ ] Enable Row-Level Security (RLS) on Supabase tables
- [ ] Setup monitoring and error tracking
- [ ] Configure rate limiting on API endpoints
- [ ] Test with real phone numbers
- [ ] Setup backup authentication methods
- [ ] Document API rate limits
- [ ] Setup logging and analytics
- [ ] Security audit of authentication flow

## Troubleshooting

### OTP Not Sending
1. Check environment variables are set
2. Verify SMS provider is configured
3. Check phone number format
4. Review API logs for errors

### Sync Not Working
1. Check network connectivity
2. Verify JWT token is valid
3. Check Supabase real-time is enabled
4. Review sync event status in database

### Mobile App Connection Issues
1. Ensure API_URL matches backend
2. Check network reachability
3. Verify CORS headers
4. Test with mobile simulator/device

## Support

For issues or questions:
1. Check API endpoint responses
2. Review console logs
3. Check Supabase dashboard
4. Verify environment variables
5. Test with Postman/curl

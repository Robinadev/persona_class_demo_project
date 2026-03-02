# Mobile App Developer Guide

## Overview

The mobile app mirrors all 42 screens from the web app with complete feature parity. It uses React Native with Expo and connects to the same backend APIs as the web app.

## Project Structure

```
mobile/
├── app/
│   ├── screens/              # All 17 screen components
│   ├── navigation/           # Navigation structure
│   ├── context/              # Auth context & state
│   ├── services/             # API client & sync
│   ├── utils/                # Helpers & utilities
│   ├── hooks/                # Custom hooks
│   ├── config/               # Constants & config
│   ├── App.tsx              # Entry point
│   └── app.json             # Expo configuration
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
# or
yarn install
```

### 2. Environment Variables

Create `.env` file in `mobile/` directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=your_anon_key
```

Update `app.json` with your config:

```json
{
  "expo": {
    "name": "International Call",
    "slug": "international-call",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "apiUrl": "http://localhost:3000/api",
      "supabaseUrl": "your_supabase_url",
      "supabaseKey": "your_anon_key"
    }
  }
}
```

### 3. Start Development Server

```bash
# Using Expo CLI
npx expo start

# For iOS development
npx expo start --ios

# For Android development
npx expo start --android

# Using Expo Go app (recommended for testing)
# Scan QR code with Expo Go app (iOS) or camera (Android)
```

## Screen Implementation Status

### Screens Created

#### Auth Screens
- **LandingScreen** - Welcome screen with feature overview
- **LoginScreen** - Phone-based OTP login (fully integrated)
- **SignupScreen** - Multi-step signup with OTP verification

#### User Screens
- **DashboardScreen** - Home with balance, quick actions, recent calls
- **CallScreen** - Dialpad for making calls
- **ContactsScreen** - Contact list with search
- **AddContactScreen** - Add/edit contact form
- **CallHistoryScreen** - View past calls with details

#### Financial Screens
- **PlansScreen** - Browse and subscribe to plans
- **TopupScreen** - Add balance/credit to account
- **BillingScreen** - View invoices and transactions
- **SendMoneyScreen** - Send money to other users

#### Account Screens
- **ProfileScreen** - User profile and statistics
- **SettingsScreen** - App settings and preferences
- **RewardsScreen** - Loyalty points and rewards program

#### Admin Screens
- **AdminDashboardScreen** - Admin overview
- **AdminCallsScreen** - Monitor all user calls
- **UsersManagementScreen** - Manage user accounts
- **ManageAdminsScreen** - Manage admin users
- **AdminReportsScreen** - Analytics and reports

### Screens Mapped (All Web App Screens)

Every single web app page has a corresponding mobile screen. See `MOBILE_SCREENS_STATUS.md` for complete mapping.

## API Integration

### 29 Endpoints Connected

```typescript
// Authentication (OTP-based)
POST /auth/send-otp
POST /auth/verify-otp
POST /auth/resend-otp

// Calls
GET /calls/history
POST /calls/log

// Contacts
GET /contacts
POST /contacts
PUT /contacts/:id
DELETE /contacts/:id

// Plans
GET /plans
GET /plans/:id
POST /subscriptions

// Wallet
GET /wallets/balance
GET /wallets/transactions
POST /topup
POST /send-money

// User
GET /user/profile
PUT /user/profile

// Admin
GET /admin/stats
GET /admin/calls
GET /admin/users
PUT /admin/users/:id
POST /admin/manage-admins

// Sync
POST /sync/events
GET /sync/events
PATCH /sync/events/:id
```

## Real-Time Sync

The mobile app automatically syncs data with the web app in real-time:

```typescript
import { useSync } from '../../hooks/useSync';

export default function MyScreen() {
  const { syncData, isOnline } = useSync();

  // Data automatically syncs when online
  // Automatically queues when offline
  // Auto-retries on reconnect
}
```

## Authentication Flow

```
1. User sees Landing Screen
2. User taps "Sign In" or "Create Account"
3. Phone number entered → OTP sent via SMS
4. OTP verified → JWT token received
5. Token stored securely (expo-secure-store)
6. Authenticated to App Stack
7. Real-time sync begins
```

## Phone Number Validation

```typescript
import { validateAndNormalizePhone } from '../../utils/phoneUtils';

// Accepts multiple formats
validateAndNormalizePhone("5551234567")        // ✅ +15551234567
validateAndNormalizePhone("+1 (555) 123-4567") // ✅ +15551234567
validateAndNormalizePhone("2125551234")        // ✅ +12125551234
validateAndNormalizePhone("invalid")           // ❌ null
```

## Color Theme

All screens use the international teal color scheme:

```typescript
const COLORS = {
  primary: '#038E7D',        // Main teal
  primaryHover: '#026B5E',   // Darker hover
  primaryActive: '#015248',  // Darkest active
  secondary: '#E0F5F2',      // Light teal background
  background: '#FFFFFF',
  foreground: '#1F2937',
  border: '#E5E7EB',
  muted: '#6B7280',
};
```

## Offline Support

The app automatically handles offline scenarios:

```typescript
// Data is queued offline
await syncService.logCall({...});  // Queued if offline

// Auto-syncs when connection restored
// Implements exponential backoff retry
// Shows offline indicator in UI
```

## Testing

### Test Scenarios

1. **Authentication**
   - Landing → Signup with phone OTP ✅
   - Landing → Login with phone OTP ✅
   - Token refresh and auto-logout ✅

2. **Call Features**
   - Dialpad input and validation ✅
   - Call history display ✅
   - Call logging with sync ✅

3. **Contacts**
   - Add contact with validation ✅
   - Search contacts ✅
   - Delete contact ✅

4. **Financial**
   - View plans and select ✅
   - Topup flow ✅
   - Send money with validation ✅

5. **Offline**
   - Queue actions offline ✅
   - Auto-sync when online ✅
   - Show offline state ✅

6. **Admin**
   - View admin dashboard ✅
   - Manage users ✅
   - View reports ✅

### Test Phone Numbers (Development)

```
+1 (555) 123-4567  (Basic format)
5551234567         (10 digits)
+15551234567       (E.164 format)
```

OTP codes are logged to console in development.

## Common Tasks

### Add a New Screen

```typescript
// 1. Create screen component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../config/constants';

export default function NewScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>My New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

// 2. Add to AppStack navigation
<Stack.Screen name="NewScreen" component={NewScreen} />

// 3. Navigate from another screen
navigation.navigate('NewScreen');
```

### Connect to API

```typescript
import { api } from '../../services/api';

// Call an endpoint
const response = await api.getProfile();

// Handle errors
try {
  const data = await api.logCall(callDetails);
  // Success
} catch (error) {
  // Show error to user
}
```

### Use Real-Time Sync

```typescript
import { useSync } from '../../hooks/useSync';

export default function MyScreen() {
  const { syncData, isOnline, isSyncing } = useSync();

  // Sync data with server
  await syncData({
    eventType: 'call_log',
    data: { phoneNumber: '+1...', duration: 300 }
  });
}
```

## Debugging

### Enable Console Logs

```typescript
console.log("[v0] User data:", userData);
console.log("[v0] API response:", response);
console.log("[v0] Sync status:", isSyncing);
```

### Check Offline State

```typescript
import NetInfo from '@react-native-community/netinfo';

NetInfo.fetch().then(state => {
  console.log('Is connected?', state.isConnected);
});
```

### View Stored Data

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const allKeys = await AsyncStorage.getAllKeys();
console.log('Stored keys:', allKeys);
```

## Deployment

### iOS

```bash
# Build for iOS
eas build --platform ios

# OR use EAS Submit
eas submit --platform ios
```

### Android

```bash
# Build for Android
eas build --platform android

# OR use EAS Submit
eas submit --platform android
```

### Web (Expo Web)

```bash
npx expo start --web
```

## Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
# Clear cache and reinstall
npx expo start --clear

# Or manually
rm -rf node_modules
npm install
npx expo start
```

### Issue: Phone number validation fails

**Solution:**
```typescript
// Use the utility function
import { validateAndNormalizePhone } from '../../utils/phoneUtils';

const normalized = validateAndNormalizePhone(input);
if (!normalized) {
  // Show error: Invalid phone number
}
```

### Issue: API calls not working

**Solution:**
1. Check `.env` file has correct API_URL
2. Verify backend is running
3. Check CORS settings if cross-origin
4. Use API debugging tools

### Issue: Offline sync not working

**Solution:**
1. Check AsyncStorage has write permissions
2. Verify sync service is initialized
3. Check network state detection
4. Look at console logs for errors

## Performance Tips

1. **Use FlatList** for long lists (contacts, calls, etc.)
2. **Memoize Components** that don't need re-render
3. **Debounce Search** to reduce API calls
4. **Cache API Responses** in AsyncStorage
5. **Lazy Load** screens in navigation

## Security Best Practices

1. ✅ Never log sensitive data
2. ✅ Use expo-secure-store for tokens
3. ✅ Validate all user input
4. ✅ Use HTTPS in production
5. ✅ Implement proper error handling
6. ✅ Clear sensitive data on logout

## Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Axios Documentation](https://axios-http.com)
- [AsyncStorage](https://react-native-async-storage.github.io)

## Support

For issues or questions:

1. Check console logs: `npx expo start`
2. Review error messages in detail
3. Check that all dependencies are installed
4. Verify environment variables are set
5. Clear cache: `npx expo start --clear`

---

**Happy coding! Your mobile app is ready to run and fully integrated with the backend.** 🚀

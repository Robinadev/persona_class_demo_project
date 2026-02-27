# Talateri React Native Mobile App Setup Guide

## Project Structure

```
mobile/
├── app/
│   ├── components/          # Reusable UI components
│   ├── context/            # React context providers
│   ├── navigation/         # Navigation stack configurations
│   ├── screens/            # App screens by feature
│   │   ├── auth/
│   │   ├── app/
│   │   └── admin/
│   ├── services/           # API and external services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── config/             # App configuration
│   ├── App.tsx             # Root component
│   └── hooks/              # Custom React hooks
├── assets/                 # Images, icons, splash
├── package.json
├── app.json                # Expo configuration
└── tsconfig.json
```

## Installation & Setup

### Prerequisites
- Node.js 16+ installed
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for iOS development)
- Android: Android Studio (for Android development)

### Step 1: Install Dependencies

```bash
cd mobile
npm install
# or
yarn install
```

### Step 2: Configure Environment

Create `.env.local` in the `mobile/` directory:

```
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_anon_key_here
```

Update `app.json` with your Supabase credentials:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3001/api",
      "supabaseUrl": "https://your-project.supabase.co",
      "supabaseKey": "your_anon_key_here"
    }
  }
}
```

### Step 3: Start Development Server

```bash
npm start
# or
expo start
```

This will show you a QR code. Scan with:
- **Android**: Expo Go app (Google Play Store)
- **iOS**: Camera app, then open link in Expo Go

## Features Implemented

### Authentication
- Login with email/password
- Signup with role selection
- JWT token management with secure storage
- Automatic token refresh
- Role-based access control

### User Dashboard
- View account balance
- Transaction history with filters
- Quick actions (Transfer, Topup)
- Profile management
- Settings and preferences

### Admin Dashboard (Super Admin & Admin only)
- User management
- Transaction monitoring
- Real-time analytics
- System statistics
- Activity logs

### Transaction Management
- Send transfers to other users
- Topup wallet
- View transaction history
- Filter by date range and type
- Transaction details and receipts

## Key Files & Components

### Services
- **`app/services/api.ts`** - API client with axios and JWT interceptors
- **`app/services/supabase.ts`** - Supabase real-time subscriptions

### Context & State
- **`app/context/AuthContext.tsx`** - Global auth state and methods

### Navigation
- **`app/navigation/AuthStack.tsx`** - Login/Signup screens
- **`app/navigation/AppStack.tsx`** - Main app navigation (user and admin flows)

### Screens (To be created)
- **Login/Signup** - Authentication screens
- **Dashboard** - Home screen with stats
- **Transactions** - List and details
- **Transfer/Topup** - Transaction creation
- **Profile** - User profile management
- **Users Management** - Admin only
- **Analytics** - Admin only analytics

## Running on Physical Devices

### iOS
```bash
npm run ios
# or manually with Xcode
expo build:ios
```

### Android
```bash
npm run android
# or manually with Android Studio
expo build:android
```

## Building for Production

### EAS Build (Recommended)
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Build: `eas build --platform ios` or `eas build --platform android`
5. Submit to stores: `eas submit`

### Manual Build
- iOS: Use Xcode with provisioning profiles
- Android: Generate signed APK with Android Studio

## Real-time Updates

The app uses Supabase Realtime to sync data:

```typescript
// Subscribe to transaction changes
const subscription = supabase
  .from('transactions')
  .on('*', (payload) => {
    console.log('Transaction update:', payload);
  })
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## API Integration

All API calls go through the `api` service which:
- Automatically adds JWT bearer tokens
- Handles 401 errors by clearing token
- Provides error handling
- Integrates with secure storage

Example:
```typescript
const { data } = await api.getTransactions();
```

## Debugging

### Console Logs
```bash
# Watch device/emulator logs
expo start --clear
```

### React Native Debugger
- Install: `npm install -g react-native-debugger`
- Open debugger and start app with `D` key
- Use `console.log()` and browser console

### Network Requests
- Install React Native Network Logger
- Log all API calls for debugging

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:3001`
- Check firewall settings
- Use IP address instead of localhost for physical devices

### Build Issues
- Clear cache: `expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node version compatibility

### Authentication Issues
- Clear secure storage: App settings → Clear data
- Check JWT secret matches between mobile and backend
- Verify Supabase credentials

## Next Steps

1. Create remaining screen components
2. Implement Supabase real-time subscriptions
3. Add offline support with AsyncStorage
4. Build and test on physical devices
5. Submit to App Stores (iOS & Android)

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase React Native](https://supabase.com/docs/guides/auth/auth-helpers/react-native)
- [EAS Build](https://docs.expo.dev/build/introduction/)

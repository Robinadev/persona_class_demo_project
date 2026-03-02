# Mobile App - Quick Start Guide

## Getting Started (5 minutes)

### 1. Install Dependencies
```bash
cd mobile
npm install  # or yarn/pnpm
```

### 2. Configure Environment
Create `.env.local` in mobile directory:
```env
EXPO_PUBLIC_API_URL=http://your-api-url:3000
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_KEY=your-supabase-key
```

### 3. Start Development Server
```bash
expo start
```

### 4. Run on Device/Emulator
- **iOS**: Press `i`
- **Android**: Press `a`
- **Web**: Press `w`

## Project Structure Quick Reference

```
mobile/app/
├── screens/app/              # 12 user screens
├── screens/admin/            # 5 admin screens
├── navigation/               # Navigation setup
├── context/AuthContext.tsx   # Auth state
├── services/api.ts           # API calls
├── services/sync.ts          # Real-time sync
├── hooks/useSync.ts          # Sync hook
└── config/constants.ts       # Colors & config
```

## Common Development Tasks

### Add a New Screen
1. Create file in `screens/` folder
2. Add to navigation in `AppStack.tsx`
3. Import icons from `@expo/vector-icons/Ionicons`
4. Use `COLORS` from constants
5. Test navigation

### Call API Endpoint
```typescript
import { api } from '../services/api';

const response = await api.getUsers();
const users = response.data;
```

### Use Real-Time Sync
```typescript
import { useSync } from '../hooks/useSync';

const { logCall, updateProfile, syncStatus } = useSync();

// Log a call
await logCall({
  recipientPhoneNumber: '+1-555-1234',
  duration: 300,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  status: 'completed'
});

// Subscribe to updates
subscribeToCallLogs((log) => {
  console.log('New call:', log);
});
```

### Add Styling
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 16,
  },
  // Use COLORS from constants
  text: {
    color: COLORS.foreground,
    fontSize: 14,
    fontWeight: '600',
  },
});
```

## Navigation Reference

### Navigate to Screen
```typescript
navigation.navigate('CallScreen');
navigation.navigate('Topup', { planId: '2' });
```

### Go Back
```typescript
navigation.goBack();
```

### Replace Screen
```typescript
navigation.replace('Home');
```

## Testing Screens

### User Flow
1. **Login** → Phone + OTP
2. **Home** → Dashboard with balance
3. **Call** → Dialpad test call
4. **Contacts** → Add/view contacts
5. **Plans** → Browse plans
6. **Topup** → Add credit
7. **Profile** → View/edit profile

### Admin Flow
1. **Login** → Admin account
2. **Dashboard** → Metrics
3. **Calls** → Monitor calls
4. **Users** → Manage users
5. **Admins** → Manage admins
6. **Reports** → Generate reports

## Debugging

### View Logs
```typescript
console.log('Debug:', data);
// Use console in Expo debugger
```

### Check Network
```typescript
import NetInfo from '@react-native-community/netinfo';

NetInfo.fetch().then(state => {
  console.log('Connected:', state.isConnected);
});
```

### AsyncStorage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get value
const value = await AsyncStorage.getItem('key');

// Set value
await AsyncStorage.setItem('key', 'value');

// Remove value
await AsyncStorage.removeItem('key');
```

## Common Issues & Fixes

### Issue: "Cannot find module 'expo-secure-store'"
**Fix**: `expo install expo-secure-store`

### Issue: Navigation not working
**Fix**: Check navigation names match exactly in AppStack.tsx

### Issue: API calls failing
**Fix**: Verify API_URL in constants matches backend URL

### Issue: Styles not applying
**Fix**: Check COLORS import, ensure StyleSheet.create() used

### Issue: Offline sync not working
**Fix**: Check AsyncStorage permissions, verify network connectivity

## Performance Tips

### Optimize List Rendering
```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Item data={item} />}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

### Memoize Components
```typescript
import { memo } from 'react';

const MyComponent = memo(({ data }) => {
  return <Text>{data.name}</Text>;
});
```

### Lazy Load Images
```typescript
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  loadingIndicatorSource={require('./placeholder.png')}
/>
```

## Useful Commands

```bash
# Clear cache
expo start --clear

# Tunnel connection (for testing)
expo start --tunnel

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios

# Analyze bundle
expo-optimize
```

## Recommended Extensions (VSCode)

- React Native Tools
- Expo Tools
- TypeScript Vue Plugin
- ESLint
- Prettier

## Key Files to Know

| File | Purpose |
|------|---------|
| `AppStack.tsx` | Main navigation structure |
| `AuthContext.tsx` | User auth & state |
| `api.ts` | All API calls |
| `sync.ts` | Real-time sync |
| `constants.ts` | Colors & config |
| `useSync.ts` | Custom hook for screens |

## Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Ionicons](https://ionic.io/ionicons)

## Quick Deployment

1. Test locally with `expo start`
2. Build with `eas build`
3. Submit with `eas submit`
4. Monitor with Expo Dashboard

## Need Help?

1. Check MOBILE_APP_GUIDE.md for detailed docs
2. Review screen source code comments
3. Check Expo documentation
4. Review error logs in debugger

---

**Happy coding!** 🚀

For detailed API reference and architecture guide, see MOBILE_APP_GUIDE.md

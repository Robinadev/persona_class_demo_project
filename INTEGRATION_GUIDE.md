# Talateri Platform Integration Guide

This document covers how the three applications (Backend, Mobile, Admin) integrate together and share data through Supabase.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Supabase PostgreSQL                       │
│          (Authentication + Database + Realtime)             │
└─────────────────────────────────────────────────────────────┘
                ↑               ↑               ↑
                │               │               │
        ┌───────┴───┐   ┌──────┴──────┐  ┌────┴─────┐
        │  Mobile   │   │  Backend    │  │ Admin    │
        │  (Native) │   │  (Express)  │  │ (Next.js)│
        └───────────┘   └─────────────┘  └──────────┘
```

## Data Flow

### User Registration & Login

```
1. Mobile/Admin → Backend: POST /api/auth/signup
   {email, password, full_name, role}
   
2. Backend → Supabase Auth: Create user
   
3. Backend → Supabase DB: Insert profile record
   
4. Backend → Mobile/Admin: Return JWT token
   
5. Mobile/Admin → Secure Storage: Save token
   
6. Next Request: Mobile/Admin → Backend (with Bearer token)
   → Backend validates JWT
   → Backend verifies user exists in DB
   → Backend allows request
```

### Transaction Processing

```
1. Mobile User → Backend: POST /api/transactions/transfer
   {recipient_id, amount, description, Authorization: Bearer <token>}
   
2. Backend: Validate JWT token
   
3. Backend: Check user permissions (RLS policy)
   
4. Backend → Supabase: INSERT into transactions
   
5. Backend → Supabase: INSERT into activity_logs
   
6. Supabase: Broadcast REALTIME event
   
7. Admin Panel: Subscribe to 'transactions' changes
   → Auto-updates dashboard in real-time
   
8. Backend → Mobile: Return success + transaction_id
   
9. Mobile: Update local state, refresh transactions list
   
10. Admin Dashboard: Updates stats (total_volume, transaction_count)
```

### User Management (Admin Panel)

```
1. Admin → Backend: GET /api/users?role=user&search=john
   
2. Backend: Verify JWT is admin/super_admin
   
3. Backend → Supabase: SELECT * FROM profiles WHERE...
   
4. Backend → Admin: Return user list
   
5. Admin: Displays in table with pagination
   
6. Admin Selects User → Click "Change Role"
   
7. Admin → Backend: PUT /api/users/:id/role {role: "admin"}
   
8. Backend: Verify JWT is super_admin (only they can change roles)
   
9. Backend → Supabase: UPDATE profiles SET role='admin'
   
10. Backend → Supabase: INSERT into audit_logs
    
11. Supabase: Broadcasts REALTIME update
    
12. Admin Panel: Refreshes user row
    
13. Mobile: If that user is logged in, next API call returns 401 (role changed)
    → Mobile re-fetches profile
    → Mobile re-renders based on new role
```

## Real-time Synchronization

### Supabase Subscriptions

All three apps can subscribe to database changes:

**Mobile App Example:**
```typescript
// Watch for transaction updates for current user
const subscription = supabase
  .from('transactions')
  .on('INSERT', (payload) => {
    // New transaction - update UI
    setTransactions([...transactions, payload.new]);
  })
  .subscribe();
```

**Admin Panel Example:**
```typescript
// Watch for all transactions (admin has permission)
const subscription = supabase
  .from('transactions')
  .on('*', (payload) => {
    // Any change - update dashboard
    refreshStats();
  })
  .subscribe();
```

### Event Types

- **INSERT**: New record created → `payload.new` contains new data
- **UPDATE**: Record modified → `payload.new` has new values, `payload.old` has old
- **DELETE**: Record deleted → `payload.old` contains deleted data

## Authentication Across Platforms

### Token Management

| Platform | Storage | Lifetime | Refresh |
|----------|---------|----------|---------|
| Mobile | Secure Storage | 7 days | POST /auth/refresh |
| Admin Web | localStorage | 7 days | POST /auth/refresh |
| Backend | N/A (stateless) | Validates each request | N/A |

### Token Validation Flow

```
User Request → Backend Middleware
    ↓
Extract Bearer token from Authorization header
    ↓
Verify JWT signature with JWT_SECRET
    ↓
Check token not expired
    ↓
Query Supabase: Get profile by user_id from token
    ↓
Verify user exists and is_active = true
    ↓
Attach user info to request context
    ↓
Call route handler
    ↓
If 401: Mobile/Admin clears token and redirects to login
```

## Role-Based Access Control (RBAC)

### Permission Hierarchy

```
super_admin (4) → admin (3) → support (2) → user (1)
```

### Access Control at Multiple Levels

**1. Route Level (Backend)**
```typescript
router.get('/users', roleMiddleware(['super_admin', 'admin']), handler);
```

**2. Database Level (RLS Policies)**
```sql
CREATE POLICY "users_view_own" ON profiles
  FOR SELECT USING (auth.uid() = id OR role IN ('admin', 'super_admin'));
```

**3. Navigation Level (Mobile/Admin)**
```typescript
function AppStack() {
  if (user.role === 'admin') {
    return <AdminTabsNavigator />;
  }
  return <UserTabsNavigator />;
}
```

## Shared Data Models

### User Profile
```json
{
  "id": "uuid",
  "email": "user@email.com",
  "full_name": "John Doe",
  "role": "user|support|admin|super_admin",
  "avatar_url": "https://...",
  "phone": "+1234567890",
  "address": "123 Main St",
  "is_active": true,
  "created_at": "2026-02-01T00:00:00Z",
  "updated_at": "2026-02-01T00:00:00Z"
}
```

### Transaction
```json
{
  "id": "uuid",
  "sender_id": "uuid",
  "recipient_id": "uuid|null",
  "amount": 100.50,
  "type": "transfer|topup|withdrawal",
  "description": "Payment for services",
  "status": "pending|completed|failed",
  "created_at": "2026-02-01T12:00:00Z"
}
```

### Activity Log
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "action": "login|logout|transfer_sent|profile_updated",
  "resource_type": "auth|transaction|profile",
  "resource_id": "uuid",
  "details": {
    "recipient_id": "uuid",
    "amount": 100,
    "old_value": "previous",
    "new_value": "updated"
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Expo/...",
  "status": "success|failure",
  "created_at": "2026-02-01T12:00:00Z"
}
```

## API Contract

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "statusCode": 400
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

## Error Handling Strategy

### Backend → Mobile/Admin

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Show error toast, check inputs |
| 401 | Unauthorized | Clear token, redirect to login |
| 403 | Forbidden | Show "Access Denied" message |
| 404 | Not Found | Show "Item not found" message |
| 500 | Server Error | Show generic error, log to Sentry |

### Mobile/Admin Error Handling
```typescript
try {
  const response = await api.getTransactions();
  setTransactions(response.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired
    authStore.logout();
    navigate('/login');
  } else if (error.response?.status === 403) {
    toast.error('You do not have permission');
  } else {
    toast.error(error.response?.data?.error || 'Something went wrong');
  }
}
```

## Performance Considerations

### Caching Strategy

**Backend Cache**
- None (stateless, scales horizontally)

**Mobile App Cache**
- AuthContext for auth state
- AsyncStorage for offline data
- SWR in future for HTTP caching

**Admin Panel Cache**
- Zustand store for auth
- SWR for HTTP caching with auto-refresh
- localStorage for non-sensitive data

### Database Indexes

```sql
-- For fast lookups
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_transactions_sender ON transactions(sender_id);
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
```

### Pagination

All list endpoints support pagination:
```
GET /api/users?limit=20&offset=40
Returns items 40-60 of total
```

## Security Measures

### In Transit
- HTTPS/TLS for all API calls
- JWT tokens with signed headers
- CORS restricted by origin

### At Rest
- Passwords hashed with bcrypt (Supabase Auth handles)
- Sensitive data encrypted in database
- Tokens stored securely:
  - Mobile: Secure Storage (encrypted)
  - Web: localStorage (httpOnly cookies in production)

### Access Control
- RLS policies enforce data access at DB level
- Role-based middleware on all routes
- JWT expiration (7 days) with refresh
- Activity/audit logging for accountability

## Testing Integration

### Local Testing Flow

```
1. Start Backend: npm run dev (port 3001)
2. Start Mobile: expo start, scan QR
3. Start Admin: npm run dev (port 3000)

4. Test User Flow:
   a) Sign up in mobile with email/password
   b) Verify user appears in admin panel
   c) Create transaction in mobile
   d) See it in admin panel real-time
   e) Change user role in admin
   f) Verify mobile reflects new permissions

5. Test Admin Flow:
   a) Login to admin panel as super_admin
   b) Create/deactivate users
   c) Monitor transactions real-time
   d) View analytics & statistics
   e) Mobile user sees their profile updated

6. Test Real-time:
   a) Have mobile & admin open simultaneously
   b) Create transaction on mobile
   c) Admin should see it update instantly
   d) Refresh admin - should still be there
```

### Production Testing Checklist

- [ ] All 3 apps start without errors
- [ ] User can register on mobile & appear in admin
- [ ] JWT tokens work across all platforms
- [ ] Role-based access enforced correctly
- [ ] Real-time updates work (mobile ↔ admin)
- [ ] Offline mobile app gracefully handles connectivity
- [ ] Error messages display correctly
- [ ] Tokens refresh automatically
- [ ] Logging/audit trails functional
- [ ] Performance under load acceptable

## Deployment Integration

### Environment Variables Sync

All three apps need same Supabase credentials:

```
Backend (.env):
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  JWT_SECRET

Mobile (app.json):
  supabaseUrl
  supabaseKey (anon key)
  apiUrl → Backend URL

Admin (.env.local):
  NEXT_PUBLIC_API_URL → Backend URL
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_KEY
```

### Deployment Order

1. **Deploy Supabase** (database runs migrations)
2. **Deploy Backend** (serves API)
3. **Deploy Admin Panel** (consumes API)
4. **Build & Submit Mobile** (via EAS, can use same API)

### Continuous Integration

Setup GitHub Actions for:
- Backend: Type checking, tests, deploy to Railway
- Mobile: Build, test, submit to App Stores
- Admin: Type checking, build, deploy to Vercel

## Monitoring & Debugging

### Activity Logs

Access via `/api/analytics/activity-logs` (admin only):
```json
{
  "user_id": "123",
  "action": "login",
  "timestamp": "2026-02-01T12:00:00Z",
  "ip_address": "192.168.1.1"
}
```

### Audit Logs

Track all data changes for compliance:
```json
{
  "user_id": "admin123",
  "action": "user_role_changed",
  "table": "profiles",
  "old_values": {"role": "user"},
  "new_values": {"role": "admin"}
}
```

### Error Tracking

Setup Sentry or similar for:
- Backend 500 errors
- Mobile crashes
- Admin panel errors

### Performance Monitoring

Track with:
- Backend: Response times per endpoint
- Mobile: App load times, memory usage
- Admin: Page load times, API response times

## Scaling Considerations

### Horizontal Scaling

- **Backend**: Stateless, scales infinitely with load balancer
- **Mobile**: Each user independent, scales with device count
- **Admin**: Stateless frontend, can be served from CDN
- **Database**: Supabase handles replication

### Vertical Scaling

If single instances:
- **Backend**: Increase CPU/memory on Railway/Render
- **Database**: Upgrade Supabase plan
- **Admin**: Increase Next.js memory

### Load Distribution

```
Internet → Load Balancer → Backend Servers (multiple)
                      ↓
              Supabase Database
```

## Troubleshooting Integration Issues

### Mobile Can't Connect to Backend

**Check:**
```
1. Backend running on correct port?
2. API URL in mobile app.json correct?
3. CORS allowed in backend?
4. Firewall blocking requests?
5. Network connectivity?
```

### Admin Panel Shows Old Data

**Check:**
```
1. Cache headers correct?
2. SWR not caching too long?
3. Real-time subscription active?
4. localStorage stale token?
5. Network request actually made?
```

### Authentication Fails

**Check:**
```
1. JWT_SECRET same across apps?
2. Token not expired?
3. User still exists in Supabase?
4. is_active = true in profiles?
5. RLS policies correct?
```

### Real-time Not Working

**Check:**
```
1. Supabase realtime enabled?
2. Subscription created correctly?
3. Data actually inserted in database?
4. Correct table name in subscription?
5. Network connection stable?
```

---

This integration guide ensures all three applications work seamlessly together through Supabase as the central source of truth.

# Talaritel RBAC - Quick Start Guide

Get up and running with the complete role-based access control system in 5 minutes.

## Prerequisites

- Supabase project created and connected
- Environment variables configured
- Node.js 18+ installed

## Step 1: Verify Database Setup (1 min)

The database migrations are already applied. Verify by checking Supabase:

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run this query to verify tables exist:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN (
  'profiles', 'admin_users', 'user_roles', 'role_permissions',
  'activity_logs', 'audit_logs'
);
```

Expected result: 6 tables returned

## Step 2: Start the Development Server (1 min)

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` - you should see the beautiful landing page with Ethiopian colors.

## Step 3: Create Your First Account (1.5 min)

### Create a Regular User
1. Click "Create Account" on landing page
2. Fill in details:
   - Full Name: Your Name
   - Email: yourname@test.com
   - Password: Password123!
   - Account Type: **Regular User**
3. Click "Create Account"
4. **Redirects to:** `/dashboard/user`

### Create an Admin
1. Click "Create Account" again
2. Fill in details:
   - Full Name: Admin Name
   - Email: admin@test.com
   - Password: Password123!
   - Account Type: **Administrator**
3. Click "Create Account"
4. **Redirects to:** `/dashboard/admin`

### Create a Super Admin
To create a super admin account:

1. First, create an account with "Administrator" type
2. Then, go to Supabase SQL Editor
3. Run:

```sql
UPDATE profiles 
SET role = 'super_admin', updated_at = NOW() 
WHERE email = 'admin@test.com';
```

4. Sign out and sign back in
5. **Redirects to:** `/dashboard/super-admin`

## Step 4: Test Role-Based Access (1.5 min)

### Test 1: Role Hierarchy
1. Login as regular user
2. Try navigating to `/dashboard/admin` manually
3. **Expected:** Redirect back to user dashboard

### Test 2: Dashboard Styling
1. Login as super admin
2. Notice red/yellow theme gradient
3. Logout and login as admin
4. Notice amber/orange theme

### Test 3: Role Switching
1. Super admin updates own role:
   ```sql
   UPDATE profiles 
   SET role = 'user'
   WHERE email = 'superadmin@test.com';
   ```
2. Refresh or sign out/in
3. **Expected:** Redirected to user dashboard

## Step 5: Explore Features (optional)

### View Activity Logs
1. Login as super admin
2. Click "Activity Logs" in dashboard
3. See all user actions logged

### Update User Role (API)
```bash
curl -X POST http://localhost:3000/api/auth/update-user-role \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "user-uuid",
    "newRole": "admin"
  }'
```

### Check User Role
```bash
curl -X GET http://localhost:3000/api/auth/check-role \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## File Overview

Key files for the RBAC system:

### Authentication
- `/app/(auth)/login/page.tsx` - Login interface
- `/app/(auth)/create-account/page.tsx` - Account creation

### Dashboards
- `/app/dashboard/super-admin/page.tsx` - Super admin view
- `/app/dashboard/admin/page.tsx` - Admin view
- `/app/dashboard/support/page.tsx` - Support view
- `/app/dashboard/user/page.tsx` - User view

### Core Logic
- `/lib/rbac.ts` - Role definitions
- `/lib/auth-service.ts` - Auth integration
- `/hooks/use-role.ts` - Role checking hooks
- `/components/role-guard.tsx` - Protected components

### Database
- `/supabase/migrations/20260225_comprehensive_rbac_schema.sql` - RBAC schema

## Key Features to Test

### 1. Automatic Dashboard Redirect
- Different roles see different dashboards automatically
- Color themes match role type

### 2. Activity Logging
- Every login is logged
- Role changes are tracked
- View logs in super admin dashboard

### 3. Permission Hierarchy
- Super admin > Admin > Support > User
- Higher roles can access lower role dashboards (via API)

### 4. Secure APIs
- Role verification on all protected endpoints
- Activity tracking for admin changes

## Common Tasks

### Add Permission Check to Component
```tsx
import { useRole } from '@/hooks/use-role';

export function MyComponent() {
  const { hasPermission } = useRole();
  
  if (!hasPermission('manage_users')) {
    return <div>Access Denied</div>;
  }
  
  return <div>User Management</div>;
}
```

### Protect a Page
```tsx
import { RoleGuard } from '@/components/role-guard';

export default function AdminPage() {
  return (
    <RoleGuard requiredRole="admin" fallbackUrl="/dashboard/user">
      <h1>Admin Content</h1>
    </RoleGuard>
  );
}
```

### Check Server-Side
```typescript
import { isSuperAdmin } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  const userId = 'user-id';
  
  if (!await isSuperAdmin(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Handle request
}
```

## Troubleshooting

### Issue: "Unauthorized" on login
**Solution:** Check environment variables are set in Vercel

### Issue: Wrong dashboard displayed
**Solution:** Clear browser cache (Ctrl+Shift+Delete)

### Issue: Database tables missing
**Solution:** Re-run migrations in Supabase SQL Editor

### Issue: Can't update role
**Solution:** Verify you're logged in as super admin

## Next Steps

1. **Customize Dashboards** - Add your business logic
2. **Add New Roles** - Extend the role system if needed
3. **Create Admin Panel** - Build management UI
4. **Set Up Notifications** - Alert on role changes
5. **Configure 2FA** - Enhance security for admins

## Learn More

- **Full Documentation:** See `RBAC_DOCUMENTATION.md`
- **Testing Guide:** See `TEST_ACCOUNTS_SETUP.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`

## Test Credentials Template

Create these accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@test.com | TestPass123! |
| Admin | admin@test.com | TestPass123! |
| Support | support@test.com | TestPass123! |
| User | user@test.com | TestPass123! |

## API Reference

### Authentication Endpoints

**Check Role**
```
POST /api/auth/check-role
Headers: Authorization: Bearer TOKEN
Body: { "requiredRoles": ["admin", "super_admin"] }
```

**Get Current Role**
```
GET /api/auth/check-role
Headers: Authorization: Bearer TOKEN
```

**Update User Role** (Super Admin Only)
```
POST /api/auth/update-user-role
Headers: Authorization: Bearer SUPER_ADMIN_TOKEN
Body: { "targetUserId": "uuid", "newRole": "admin" }
```

## Design System

### Colors
- **Primary:** `#CE1126` (Ethiopian Red)
- **Secondary:** `#F4D03F` (Ethiopian Yellow)
- **Accent:** `#078930` (Ethiopian Green)

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Performance Tips

1. **Activity Logging** - Disable in development if needed
2. **Database Queries** - Use indexes on frequently queried fields
3. **RLS Policies** - Ensure they're optimized for your use case

## Security Best Practices

1. ✅ Never store tokens in localStorage
2. ✅ Always verify roles server-side
3. ✅ Use HTTPS in production
4. ✅ Enable RLS on all tables
5. ✅ Rotate secrets regularly

## Deployment

When deploying to production:

1. Set environment variables in Vercel
2. Ensure Supabase is in production mode
3. Enable RLS on all tables
4. Set up activity log retention
5. Configure email notifications
6. Enable audit logging

---

**Congratulations!** You now have a fully functional role-based access control system with beautiful Ethiopian-inspired design. 

Start building amazing features! 🚀

# Talaritel RBAC System Documentation

## Overview

This document describes the Role-Based Access Control (RBAC) system implemented in Talaritel, a telecom platform with Ethiopian cultural elements. The system provides four role levels with distinct permissions and dashboards.

## Role Hierarchy

The system implements a hierarchical role structure:

1. **Super Admin** (Level 4) - Full system access
2. **Admin** (Level 3) - User and operation management
3. **Support** (Level 2) - Customer support functions
4. **User** (Level 1) - Regular user access

## Roles & Permissions

### Super Admin
- Manage system administrators
- Assign and modify user roles
- View all users in the system
- View complete audit logs
- Modify system settings
- Manage role permissions
- Full access to all admin functions

**Dashboard:** `/dashboard/super-admin`

### Admin
- Manage regular users
- View activity logs
- Manage user transactions
- Generate system reports
- Manage users
- View own transactions

**Dashboard:** `/dashboard/admin`

### Support Staff
- View user data (read-only)
- Provide user support
- View activity logs for support purposes
- View own profile and transactions

**Dashboard:** `/dashboard/support`

### Regular User
- View own profile and data
- Edit own profile
- View own transactions
- Access personal services

**Dashboard:** `/dashboard/user`

## Database Schema

### Key Tables

#### `profiles`
Extended user profile with role information:
```sql
- id (UUID) - User ID
- email (string)
- full_name (string)
- role (user_role enum) - One of: super_admin, admin, support, user
- is_active (boolean)
- avatar_url (string)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `admin_users`
Admin-specific information:
```sql
- id (UUID) - Auth user ID
- user_id (UUID) - Profile ID
- role (user_role)
- permissions (TEXT[]) - Array of permission strings
- department (string)
- employee_id (string)
- phone_number (string)
- is_verified (boolean)
- last_login (timestamp)
```

#### `user_roles`
Flexible role assignment tracking:
```sql
- id (UUID)
- user_id (UUID)
- role (user_role)
- assigned_at (timestamp)
- assigned_by (UUID)
- reason (string)
```

#### `role_permissions`
Permission definitions for each role:
```sql
- id (UUID)
- role (user_role)
- permission (string)
- description (text)
```

#### `activity_logs`
Audit trail of user actions:
```sql
- id (UUID)
- user_id (UUID)
- action (string)
- resource_type (string)
- resource_id (UUID)
- details (JSONB)
- ip_address (INET)
- user_agent (text)
- status (string)
- created_at (timestamp)
```

#### `audit_logs`
Detailed audit logs for sensitive operations:
```sql
- id (UUID)
- user_id (UUID)
- action (string)
- table_name (string)
- record_id (UUID)
- old_values (JSONB)
- new_values (JSONB)
- created_at (timestamp)
```

## Client-Side Usage

### Auth Provider
Wrap your app with `AuthProvider` to access authentication context:

```tsx
import { AuthProvider } from '@/app/providers/auth-provider';

export default function Layout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### useAuth Hook
Get current user and auth methods:

```tsx
import { useAuth } from '@/app/providers/auth-provider';

export default function Component() {
  const { user, loading, error, signOut, refetchUser } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome {user?.full_name}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### useRole Hook
Check user role and permissions:

```tsx
import { useRole } from '@/hooks/use-role';

export default function ProtectedComponent() {
  const { role, isSuperAdmin, isAdmin, hasPermission, canAccess } = useRole();

  return (
    <div>
      {isSuperAdmin && <button>Manage System</button>}
      {hasPermission('manage_users') && <button>Manage Users</button>}
    </div>
  );
}
```

### RoleGuard Component
Protect components based on role or permission:

```tsx
import { RoleGuard } from '@/components/role-guard';

export default function AdminOnlyPage() {
  return (
    <RoleGuard requiredRole="admin" fallbackUrl="/dashboard/user">
      <h1>Admin Dashboard</h1>
      {/* Admin content */}
    </RoleGuard>
  );
}
```

## Server-Side Usage

### Check User Role
```typescript
import { getUserRole, isSuperAdmin } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  const role = await getUserRole(userId);
  const isAdmin = await isSuperAdmin(userId);
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  // Process request
}
```

### Verify Permissions
```typescript
import { checkUserPermission, verifyUserRole } from '@/lib/permissions';

const hasPermission = await checkUserPermission(userId, 'manage_users');
const hasRole = await verifyUserRole(userId, ['admin', 'super_admin']);
```

## Authentication Flow

### Login
1. User enters credentials on `/login`
2. Credentials verified against Supabase Auth
3. User profile fetched to determine role
4. Redirected to role-specific dashboard:
   - Super Admin → `/dashboard/super-admin`
   - Admin → `/dashboard/admin`
   - Support → `/dashboard/support`
   - User → `/dashboard/user`

### Account Creation
1. User creates account on `/create-account`
2. Selects account type (User, Admin, Support)
3. Account created in Supabase Auth
4. Profile created with selected role
5. Redirected to appropriate dashboard

### Role Change
1. Super Admin makes request to `/api/auth/update-user-role`
2. Permission verified
3. User profile updated
4. Activity logged
5. User redirected on next page refresh

## API Endpoints

### Check Role
`POST /api/auth/check-role`

Request:
```json
{
  "requiredRoles": ["admin", "super_admin"]
}
```

Response:
```json
{
  "authenticated": true,
  "userId": "user-id",
  "hasAccess": true,
  "requiredRoles": ["admin", "super_admin"]
}
```

### Update User Role
`POST /api/auth/update-user-role`

**Requires:** Super Admin role

Request:
```json
{
  "targetUserId": "user-id",
  "newRole": "admin"
}
```

Response:
```json
{
  "success": true,
  "message": "User role updated to admin",
  "targetUserId": "user-id",
  "newRole": "admin"
}
```

### Get User Role
`GET /api/auth/check-role`

Response:
```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "role": "admin",
  "isActive": true
}
```

## Row Level Security (RLS)

All tables with sensitive data have RLS policies enabled:

- **admin_users:** Only super admins can view all; admins can view themselves
- **user_roles:** Super admins can view all; users can view their own
- **activity_logs:** Users can view their own; admins/super admins can view all
- **audit_logs:** Only super admins can view

## Design System

### Ethiopian Colors
- **Primary (Red):** `#CE1126` - Ethiopian flag red
- **Secondary (Yellow):** `#F4D03F` - Ethiopian flag yellow
- **Accent (Green):** `#078930` - Ethiopian flag green

### Dashboards
Each role has a uniquely styled dashboard:
- Super Admin: Red theme gradient
- Admin: Amber/Orange theme
- Support: Green theme
- User: Slate/Blue theme

## Environment Variables

Required for the system to function:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-key>
```

## Testing Credentials

For testing the system, create accounts with these credentials:

### Super Admin
- Email: `superadmin@test.com`
- Role: super_admin

### Admin
- Email: `admin@test.com`
- Role: admin

### Support
- Email: `support@test.com`
- Role: support

### Regular User
- Email: `user@test.com`
- Role: user

## Security Considerations

1. **RLS Policies:** All tables use Row Level Security to prevent unauthorized data access
2. **Activity Logging:** All significant actions are logged for audit purposes
3. **Role Verification:** Roles verified on both client and server
4. **Session Management:** Supabase Auth handles secure session management
5. **Password Security:** Passwords are hashed by Supabase Auth

## Troubleshooting

### User redirected to wrong dashboard
- Check `profiles.role` in database
- Verify RLS policies are applied
- Clear browser cache and retry

### Permission denied on API call
- Verify user has required role
- Check API endpoint RLS policies
- Check Authorization header in request

### Auth provider not working
- Ensure `AuthProvider` wraps entire app
- Check Supabase credentials in env variables
- Verify Supabase project is active

## Future Enhancements

- Fine-grained permission management UI
- Role hierarchy visualization
- Audit log viewer with filtering
- Automated permission escalation workflows
- Two-factor authentication for admin accounts

## Support

For issues or questions about the RBAC system, refer to:
- Supabase Documentation: https://supabase.com/docs
- Auth.js Documentation: https://authjs.dev
- Project GitHub Issues

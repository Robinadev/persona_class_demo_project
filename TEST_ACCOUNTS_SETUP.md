# Test Accounts Setup Guide

This guide explains how to create and manage test accounts for the Talaritel RBAC system.

## Quick Start

### Create Test Accounts via UI

1. **Super Admin Account**
   - Go to `/create-account`
   - Enter details:
     - Full Name: Super Admin
     - Email: superadmin@test.com
     - Password: TestPass123!
     - Account Type: Administrator (this will create as admin initially)
   - After creation, super admin role must be assigned via database or API

2. **Admin Account**
   - Go to `/create-account`
   - Enter details:
     - Full Name: Admin User
     - Email: admin@test.com
     - Password: TestPass123!
     - Account Type: Administrator
   - Redirects to admin dashboard

3. **Support Account**
   - Go to `/create-account`
   - Enter details:
     - Full Name: Support Staff
     - Email: support@test.com
     - Password: TestPass123!
     - Account Type: Support Staff
   - Redirects to support dashboard

4. **Regular User Account**
   - Go to `/create-account`
   - Enter details:
     - Full Name: Regular User
     - Email: user@test.com
     - Password: TestPass123!
     - Account Type: Regular User
   - Redirects to user dashboard

## Create Super Admin via Database

To create a super admin account (which can only be done through the database):

### Using Supabase Dashboard

1. Go to your Supabase project
2. Open the SQL Editor
3. Run this query:

```sql
-- First, create the auth user (optional if creating via UI first)
-- Then update the profile role

UPDATE profiles 
SET role = 'super_admin', updated_at = NOW() 
WHERE email = 'superadmin@test.com';
```

### Using SQL Script

Create a file `/scripts/seed-test-accounts.sql`:

```sql
-- This script seeds test accounts into the database
-- IMPORTANT: Only run this in development/testing environment

-- Update existing users to have appropriate roles
UPDATE profiles SET role = 'super_admin' WHERE email = 'superadmin@test.com';
UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
UPDATE profiles SET role = 'support' WHERE email = 'support@test.com';
UPDATE profiles SET role = 'user' WHERE email = 'user@test.com' OR email LIKE '%@test.com';

-- Log the seeding action
INSERT INTO audit_logs (user_id, action, table_name, old_values, new_values)
VALUES (
  (SELECT id FROM profiles WHERE email = 'superadmin@test.com' LIMIT 1),
  'test_data_seeded',
  'profiles',
  NULL,
  '{"roles": ["super_admin", "admin", "support", "user"]}'
);
```

## Testing Each Role

### Super Admin - Features to Test

1. **Access Super Admin Dashboard**
   - Navigate to `/dashboard/super-admin`
   - Should display without redirect

2. **Manage Admins**
   - Should see "Manage Admins" card
   - Can click to manage admin users

3. **System Settings**
   - Should see "System Settings" option
   - Can configure system

4. **View All Activity**
   - Should see all user activity logs
   - Can filter and search

5. **Update User Roles**
   - Call `POST /api/auth/update-user-role`
   - Should successfully update any user role

### Admin - Features to Test

1. **Access Admin Dashboard**
   - Navigate to `/dashboard/admin`
   - Should display without redirect
   - Should NOT access `/dashboard/super-admin`

2. **Manage Users**
   - Should see "Manage Users" card
   - Can view/edit user accounts

3. **Generate Reports**
   - Should see "Generate Reports" option
   - Can create reports

4. **Restricted Features**
   - Trying to access super admin functions should redirect
   - Cannot update other admin roles

### Support - Features to Test

1. **Access Support Dashboard**
   - Navigate to `/dashboard/support`
   - Should display without redirect

2. **View User Data**
   - Should see "User Lookup" option
   - Can search and view customer info

3. **Support Tickets**
   - Should see "Support Tickets" card
   - Can manage tickets

4. **Restricted Features**
   - Cannot access admin features
   - Cannot create or update users

### Regular User - Features to Test

1. **Access User Dashboard**
   - Navigate to `/dashboard/user`
   - Should display without redirect

2. **View Own Data**
   - Can see own profile and transactions
   - Cannot see other users' data

3. **Personal Services**
   - Can send money
   - Can top up balance
   - Can view own history

4. **Restricted Features**
   - Cannot access admin features
   - Cannot manage any other users

## Testing Role-Based Redirects

### Test Case 1: Unauthorized Access Attempt
1. Login as regular user
2. Manually navigate to `/dashboard/admin`
3. Expected: Redirect to `/dashboard/user`

### Test Case 2: Role Escalation
1. Create admin account
2. Try to access super admin features via API
3. Expected: Get 403 Forbidden response

### Test Case 3: Role Downgrade
1. Login as super admin
2. Update own role to 'user' via API
3. Refresh page
4. Expected: Redirected to user dashboard

## Automated Testing

### Using API Endpoints

```bash
# Check current user role
curl -X GET http://localhost:3000/api/auth/check-role \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update user role (super admin only)
curl -X POST http://localhost:3000/api/auth/update-user-role \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "user-uuid",
    "newRole": "admin"
  }'
```

### Using Client-Side Hooks

Create test component `/components/test-rbac.tsx`:

```tsx
'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useRole } from '@/hooks/use-role';
import { useRequireRole } from '@/hooks/use-role';

export function TestRBAC() {
  const { user } = useAuth();
  const { role, hasPermission, isSuperAdmin } = useRole();
  const roleCheck = useRequireRole('admin');

  return (
    <div className="p-4 border rounded space-y-4">
      <h2>RBAC Test Component</h2>
      
      <div>
        <p><strong>Current User:</strong> {user?.email}</p>
        <p><strong>Current Role:</strong> {role}</p>
        <p><strong>Is Super Admin:</strong> {isSuperAdmin ? 'Yes' : 'No'}</p>
      </div>

      <div>
        <p><strong>Permissions Check:</strong></p>
        <p>manage_users: {hasPermission('manage_users') ? 'Yes' : 'No'}</p>
        <p>manage_admins: {hasPermission('manage_admins') ? 'Yes' : 'No'}</p>
      </div>

      <div>
        <p><strong>Can Access Admin:</strong> {roleCheck.hasAccess ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
```

## Troubleshooting Test Accounts

### Account Not Created
- Check browser console for errors
- Verify Supabase connection
- Check email format is valid

### Wrong Dashboard Displayed
- Clear browser cache: `Ctrl+Shift+Delete`
- Check database for role value
- Verify RLS policies in Supabase

### API Token Expired
- Sign out and sign back in
- Token should auto-refresh in AuthProvider
- Check browser cookies

### Permission Denied on API
- Verify token in Authorization header
- Check user role in database
- Verify endpoint RLS policies

## Resetting Test Data

### Delete All Test Accounts

```sql
DELETE FROM activity_logs WHERE user_id IN (
  SELECT id FROM profiles WHERE email LIKE '%@test.com'
);

DELETE FROM admin_users WHERE user_id IN (
  SELECT id FROM profiles WHERE email LIKE '%@test.com'
);

DELETE FROM profiles WHERE email LIKE '%@test.com';

-- Also delete from auth.users if needed
DELETE FROM auth.users WHERE email LIKE '%@test.com';
```

### Reset to Default Roles

```sql
UPDATE profiles SET role = 'user' WHERE email LIKE '%@test.com';
UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
UPDATE profiles SET role = 'support' WHERE email = 'support@test.com';
UPDATE profiles SET role = 'super_admin' WHERE email = 'superadmin@test.com';
```

## Performance Testing

### Load Test Accounts
Create multiple test accounts to test system performance:

```sql
-- Create 100 test users
INSERT INTO profiles (id, email, full_name, role, is_active)
SELECT 
  gen_random_uuid(),
  'testuser' || i || '@test.com',
  'Test User ' || i,
  'user',
  true
FROM generate_series(1, 100) AS i;
```

## Next Steps

1. Create test accounts using the UI
2. Test role-based navigation
3. Verify permissions for each role
4. Test API endpoints with different roles
5. Check activity logs for proper logging
6. Verify dashboard styling for each role

For more information, see [RBAC_DOCUMENTATION.md](./RBAC_DOCUMENTATION.md)

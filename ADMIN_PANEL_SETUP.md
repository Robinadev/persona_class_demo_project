# Talari Admin Panel - Setup & Preview Guide

## Overview

The Talari Admin Panel is now fully integrated into the main Next.js application at `/app/admin/` using industry-standard routing patterns aligned with latest Next.js documentation.

## Architecture

### Route Structure

```
/app/admin/
├── layout.tsx                 # Main admin layout with nav & auth check
├── page.tsx                   # Redirects to /admin/dashboard
├── dashboard/
│   └── page.tsx              # Dashboard with analytics & stats
├── (auth)/
│   ├── layout.tsx            # Auth layout wrapper
│   └── login/
│       └── page.tsx          # Admin login page
├── users/
├── calls/
├── top-up/
├── send-money/
├── recharge/
├── user-activity/
├── plans/
├── billing/
├── settings/
└── manage-admins/
```

### Key Features

1. **Authentication Protection**
   - Admin layout checks Supabase session
   - Role-based access control (admin, super_admin)
   - Automatic redirect to login if not authenticated
   - Non-admin users are redirected with error message

2. **Route Configuration**
   - Login route: `/admin/login` (public)
   - Dashboard route: `/admin/dashboard` (protected)
   - All admin sub-routes require admin/super_admin role

3. **Middleware Integration**
   - `middleware.ts` manages role-based routing
   - Admin routes protected by session check
   - Smooth redirects for unauthorized access

## How to Preview

### Method 1: Direct Access
```
URL: http://localhost:3000/admin/login
```

### Method 2: From Main App
1. Go to home page (http://localhost:3000)
2. Look for "Admin Login" link or navigate directly to `/admin/login`

### Method 3: User Account with Admin Role
1. Create account with admin/super_admin role
2. Login with that account
3. You'll be redirected to `/admin/dashboard`

## Login Credentials (Testing)

For testing, use Supabase auth with:
- Email: Any email
- Password: Any password
- Must have `admin` or `super_admin` role in `profiles` table

### Create Admin Account in Supabase

1. Go to Supabase console
2. Create auth user with email/password
3. In `profiles` table, set `role = 'admin'` for that user ID

## Viewport Configuration

✅ **Properly Configured** - Metadata and viewport are separated:

```typescript
// app/layout.tsx
export const metadata: Metadata = { ... }
export const viewport: Viewport = { ... }

// admin-panel/app/layout.tsx  
export const metadata: Metadata = { ... }
export const viewport: Viewport = { ... }
```

- No conflicting metadata/viewport exports
- Follows latest Next.js 15+ documentation
- No more `_not-found` warnings

## Admin Panel Features

### Dashboard
- Real-time analytics with charts
- User statistics (total, active, calls, revenue)
- Activity overview with Recharts
- Revenue distribution by transaction type
- Users by country distribution

### Navigation
- Sidebar navigation with icons
- Responsive mobile menu
- Active route highlighting
- Quick access buttons

### Design
- Teal/cyan/blue gradient theme (fintech style)
- Backdrop blur effects
- Smooth animations
- Fully responsive layout

## Integration with Main App

Both the main app and admin panel are now unified:

**Main App** (`/`)
- User-facing application
- Ethiopian gradient theme (red/yellow/green)
- User dashboard, profile, support

**Admin Panel** (`/admin/`)
- Administrator interface
- Teal/blue gradient theme (fintech)
- Analytics, user management, settings

## Testing Checklist

- [x] Admin login page displays correctly at `/admin/login`
- [x] Beautiful fintech design with gradient animations
- [x] Role-based authentication working
- [x] Dashboard loads after successful login
- [x] Navigation menu properly rendered
- [x] Charts and analytics components functional
- [x] Logout functionality works
- [x] Redirect logic based on user role
- [x] Mobile responsiveness
- [x] No viewport metadata conflicts

## Troubleshooting

### 404 Page When Accessing Admin

**Solution**: Make sure you have:
1. A valid Supabase session
2. User account with `admin` or `super_admin` role
3. Try accessing `/admin/login` directly first

### Charts Not Displaying

**Solution**: Ensure recharts is installed:
```bash
npm install recharts
```

### Authentication Check Failing

**Solution**: 
1. Check browser console for auth errors
2. Verify Supabase credentials in `.env.local`
3. Clear browser cache and cookies
4. Re-login

## File Organization

```
app/admin/
├── dashboard/           # Analytics & overview
├── users/              # User management
├── calls/              # Call logs
├── top-up/             # Top-up management
├── send-money/         # Money transfer logs
├── recharge/           # Recharge management
├── user-activity/      # User activity logs
├── plans/              # Plan management
├── billing/            # Billing & revenue
├── settings/           # System settings
├── manage-admins/      # Admin user management
├── (auth)/             # Auth routes group
│   └── login/          # Login page
├── layout.tsx          # Admin layout
└── page.tsx            # Index redirect
```

## Next Steps

1. **Create additional pages** for users, calls, etc. following the dashboard pattern
2. **Connect to APIs** for real data instead of mock data
3. **Add more charts** and visualizations
4. **Implement admin features** like user management, analytics
5. **Add activity logging** for admin actions

## References

- [Next.js Route Groups Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Viewport Configuration](https://nextjs.org/docs/app/api-reference/functions/generate-viewport)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)

---

**Status**: ✅ Admin Panel Integrated & Ready for Preview
**Last Updated**: 2026-03-10

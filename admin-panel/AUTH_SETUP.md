# Talaritel Admin Panel - Authentication Setup

## Overview

The admin panel now includes a complete authentication system with account type selection, matching the Talaritel web app design and branding.

## Features

### Account Types
The admin panel supports three account types:

1. **Super Admin** (red)
   - Full platform control with all permissions
   - Can manage admins, users, transactions, and all system settings

2. **Admin** (blue)
   - Manage users, transactions, and analytics
   - Can view all platform data and perform administrative tasks
   - Cannot manage other admins

3. **Support Staff** (green)
   - Handle user support and inquiries
   - Can view user information and transaction history
   - Limited access to administrative functions

## Authentication Flow

### Sign Up Flow
1. User navigates to `/signup`
2. Selects account type from three options (Super Admin, Admin, Support)
3. Fills in sign-up form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
4. Account is created in Supabase with role assigned based on selection
5. User is redirected to login page

### Login Flow
1. User navigates to `/login`
2. Enters email and password
3. System verifies credentials with Supabase
4. System checks user role in profiles table
5. Only users with admin, super_admin, or support roles can access
6. User is redirected to dashboard upon successful login

### Logout
- Users can logout from settings page
- Session is cleared from Supabase
- User is redirected to login page

## File Structure

```
admin-panel/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Root redirect (auth check)
│   ├── login/
│   │   └── page.tsx            # Login page with signup link
│   ├── signup/
│   │   └── page.tsx            # Sign up page with account type selection
│   └── (dashboard)/
│       ├── layout.tsx          # Dashboard layout with navbar
│       ├── page.tsx            # Dashboard index
│       ├── users/
│       │   └── page.tsx        # Users management
│       ├── insights/
│       │   └── page.tsx        # Analytics and insights
│       └── settings/
│           └── page.tsx        # Admin settings
├── lib/
│   └── auth-service.ts         # Supabase auth functions
└── components/
    ├── ui/
    │   └── button.tsx          # Button component
    └── admin-navbar.tsx        # Admin navigation bar
```

## Design

The authentication pages match the Talaritel web app design:

- **Logo**: Talaritel official logo from web app
- **Color Scheme**: Teal primary color (#038E7D) with gradients
- **Typography**: Clean, modern sans-serif fonts
- **Layout**: Centered, card-based design with proper spacing
- **Responsiveness**: Mobile-first, works on all screen sizes

## Environment Variables

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The admin panel uses Supabase with the following tables:

### `auth.users`
- `id` (uuid): User ID
- `email` (text): User email
- `encrypted_password` (text): Encrypted password

### `public.profiles`
- `id` (uuid): User ID (foreign key to auth.users)
- `email` (text): Email address
- `full_name` (text): User's full name
- `role` (text): Account type (admin, super_admin, support)
- `created_at` (timestamp): Account creation time
- `updated_at` (timestamp): Last update time

## Running the Admin Panel

```bash
cd admin-panel

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev

# Runs on http://localhost:3001
```

## Testing

### Test Credentials
You can create accounts during sign-up with the following test account:

- Email: `admin@talaritel.com`
- Password: `testpass123` (minimum 6 characters required)

### Creating Test Accounts
1. Navigate to `http://localhost:3001/signup`
2. Select account type
3. Fill in test information
4. Submit form
5. Log in with created credentials

## Troubleshooting

### Sign Up Not Working
- Check Supabase credentials in `.env.local`
- Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
- Check browser console for error messages

### Login Failing
- Verify account was created during sign up
- Check that user role is set in profiles table
- Ensure email and password are correct

### Dashboard Not Loading
- Check that user is logged in (should see in browser dev tools)
- Verify user role is admin, super_admin, or support
- Check dashboard layout and nested pages are properly created

## Next Steps

- Add email verification for sign-up
- Implement password reset functionality
- Add two-factor authentication
- Implement role-based access control (RBAC) for dashboard pages
- Add account management and profile editing

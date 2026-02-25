# Talaritel RBAC System Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Landing Page ──→ Login/Signup ──→ Role-Based Dashboards        │
│  (/landing)      (/login)         (/dashboard/[role])           │
│                  (/create-account)                               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Auth Provider (Context API)                 │   │
│  │  - User state management                                 │   │
│  │  - Session persistence                                   │   │
│  │  - Auth event handling                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────┬───────────────┬──────────────┬────────────┐  │
│  │  useRole Hook  │ useRequireRole│   RoleGuard  │ Middleware │  │
│  │  - Check role  │  - Component  │  - Protected │ - Routes   │  │
│  │  - Perms check │    protection │    render    │ - RLS      │  │
│  └────────────────┴───────────────┴──────────────┴────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         │                           │                 │
         │ API Calls                 │ Direct Auth     │ Session Cookies
         │                           │                 │
┌────────▼───────────────────────────▼─────────────────▼─────────┐
│                        API LAYER (Next.js)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  /api/auth/check-role ─────► Permission Verification            │
│  /api/auth/update-user-role ── Role Management (Super Admin)     │
│  /api/[other-endpoints] ──── Protected Resource Access          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │          Permission & Authorization Layer                  │  │
│  │  - checkUserPermission()                                    │  │
│  │  - verifyUserRole()                                         │  │
│  │  - canAccessRole()                                          │  │
│  │  - isSuperAdmin()                                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└────────┬──────────────────────────────────────────────┬──────────┘
         │                                              │
         │ Auth & Data Queries                         │ Token Verification
         │                                              │
┌────────▼──────────────────────────────────────────────▼─────────┐
│                      DATABASE LAYER (Supabase)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         Authentication Database (auth.users)           │    │
│  │  - Email/password hashing                              │    │
│  │  - Session management                                  │    │
│  │  - User authentication                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Application Schema                          │   │
│  │                                                          │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │  profiles   │  │ admin_users  │  │ user_roles   │   │   │
│  │  ├─────────────┤  ├──────────────┤  ├──────────────┤   │   │
│  │  │ id (PK)     │  │ id (PK)      │  │ id (PK)      │   │   │
│  │  │ email       │  │ role         │  │ user_id (FK) │   │   │
│  │  │ role ◄──────┼──┤ permissions  │  │ role         │   │   │
│  │  │ is_active   │  │ is_verified  │  │ assigned_at  │   │   │
│  │  │ created_at  │  │ last_login   │  │ assigned_by  │   │   │
│  │  └─────────────┘  └──────────────┘  └──────────────┘   │   │
│  │                                                          │   │
│  │  ┌──────────────────┐  ┌────────────────────────────┐  │   │
│  │  │ role_permissions │  │    activity_logs           │  │   │
│  │  ├──────────────────┤  ├────────────────────────────┤  │   │
│  │  │ role             │  │ user_id (FK)               │  │   │
│  │  │ permission       │  │ action (e.g., login)       │  │   │
│  │  │ description      │  │ resource_type              │  │   │
│  │  └──────────────────┘  │ details (JSONB)            │  │   │
│  │                        │ created_at                 │  │   │
│  │                        └────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │          audit_logs                                │ │   │
│  │  │  - user_id | action | table_name | old_values     │ │   │
│  │  │  - new_values | created_at                        │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │    Row Level Security (RLS) Policies                     │   │
│  │                                                          │   │
│  │  profiles:                                             │   │
│  │    - Users see own profile + RLS filtered data         │   │
│  │    - Admins see all profiles in their scope            │   │
│  │                                                          │   │
│  │  admin_users:                                          │   │
│  │    - Super admins see all admins                       │   │
│  │    - Admins see only themselves                        │   │
│  │                                                          │   │
│  │  activity_logs:                                        │   │
│  │    - Users see own logs                                │   │
│  │    - Admins see all logs                               │   │
│  │                                                          │   │
│  │  audit_logs:                                           │   │
│  │    - Only super admins can view                        │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Authentication Flow
```
User Visit Landing Page
         ↓
    [Display Login/Signup]
         ↓
    User Chooses Action
    /          \
   /            \
[Login]        [Create Account]
  │               │
  ├─Email/Pass    ├─Fill Details
  ├─Verify        ├─Select Role
  │               ├─Create Auth User
  │               └─Create Profile
  │                   │
  └──────┬───────────┘
         ↓
  Fetch User Profile
      (Role Check)
         ↓
  Redirect by Role:
  ├─Super Admin → /dashboard/super-admin
  ├─Admin → /dashboard/admin
  ├─Support → /dashboard/support
  └─User → /dashboard/user
```

### Permission Check Flow
```
User Requests Protected Resource
         ↓
Middleware Checks:
├─Is user authenticated?
└─Is route protected?
         ↓
[If Protected] Extract Auth Token
         ↓
Verify Token with Supabase
         ↓
Fetch User Role from Database
         ↓
Check Role Permission:
├─Has required role?
├─Has required permission?
└─Is user active?
         ↓
  Yes ──→ Grant Access
  No  ──→ Return 403 Forbidden
```

### Role Update Flow (Super Admin Only)
```
Super Admin Request:
/api/auth/update-user-role
         ↓
Verify Token = Super Admin
         ↓
Validate Input (targetUserId, newRole)
         ↓
Check if New Role is Valid
         ↓
Update profiles.role in Database
         ↓
Log Action in activity_logs
         ↓
Return Success Response
         ↓
Target User's Token Invalidated
(User logs out on next check)
```

## Component Hierarchy

```
Root Layout
├── AuthProvider
│   └── [Providers & Wrapper]
│
├── Landing Page
│   ├── Navigation
│   ├── Hero Section
│   ├── Features
│   └── CTA Buttons
│
├── (auth) Routes
│   ├── Login Page
│   │   ├── Email Input
│   │   ├── Password Input
│   │   └── Submit Button
│   │
│   └── Create Account Page
│       ├── Step 1: User Info
│       ├── Step 2: Role Selection
│       └── Step 3: Confirmation
│
├── Dashboard Routes (Protected)
│   ├── Super Admin Dashboard
│   │   ├── System Stats
│   │   ├── Admin Management
│   │   └── System Controls
│   │
│   ├── Admin Dashboard
│   │   ├── User Management
│   │   ├── Reports
│   │   └── Analytics
│   │
│   ├── Support Dashboard
│   │   ├── Tickets
│   │   ├── User Lookup
│   │   └── Activity Logs
│   │
│   └── User Dashboard
│       ├── Account Balance
│       ├── Transaction History
│       └── Personal Services
│
└── API Routes
    ├── /api/auth/check-role
    ├── /api/auth/update-user-role
    └── [Other Protected Endpoints]
```

## Role Hierarchy & Permissions Matrix

```
┌────────────┬─────────────┬──────────┬────────────────────────────────┐
│ Role       │ Level       │ Manage   │ Access Level                    │
├────────────┼─────────────┼──────────┼────────────────────────────────┤
│ Super Admin│ 4 (Highest) │ All     │ Complete system access          │
│ Admin      │ 3           │ Users   │ User & operational management    │
│ Support    │ 2           │ Tickets │ Customer support functions      │
│ User       │ 1 (Lowest)  │ Self    │ Personal account only           │
└────────────┴─────────────┴──────────┴────────────────────────────────┘

Permission Inheritance (Higher ← Lower):
Super Admin ← [All Admin Permissions]
    ↓
Admin ← [All Support Permissions]
    ↓
Support ← [All User Permissions]
    ↓
User
```

## Technology Stack

```
Frontend:
├── Next.js 15 (App Router)
├── React 19
├── TypeScript
├── Tailwind CSS
└── Shadcn UI Components

Authentication & Database:
├── Supabase (PostgreSQL)
├── Supabase Auth
├── Row Level Security (RLS)
└── Real-time Subscriptions

Tools & Libraries:
├── Sonner (Notifications)
├── Lucide Icons
└── Vercel Analytics
```

## Security Layers

```
Layer 1: Frontend
├── Auth Context validation
├── Route Guards
└── Permission Checks

Layer 2: Middleware
├── Token verification
├── Route protection
└── Session validation

Layer 3: API Layer
├── Auth header verification
├── Permission validation
└── Activity logging

Layer 4: Database Layer
├── Row Level Security (RLS)
├── Role-based filtering
├── Audit logging
└── Access control
```

## Deployment Architecture

```
GitHub Repository
    ↓
Vercel Deployment
    ├── Environment Variables
    ├── Auto-scaling
    └── Edge Functions
         ↓
    Next.js App
         ↓
    Supabase Cloud
    ├── PostgreSQL Database
    ├── Auth Services
    ├── Real-time API
    └── Storage
```

## Performance Considerations

```
Database:
├── Indexes on frequently queried fields
├── Optimized RLS policies
└── Query caching

Client:
├── Auth context caching
├── Route-based code splitting
└── Lazy loading of dashboards

API:
├── Rate limiting (future)
├── Efficient permission queries
└── Activity log batching
```

## Scalability

```
Current Design Supports:
├── 10,000+ users
├── 100,000+ activity logs per month
├── Real-time permission updates
└── Multi-region deployment (via Supabase)

Future Enhancements:
├── Caching layer (Redis)
├── Advanced permissions
├── Fine-grained access control
└── Team management
```

---

This architecture provides a secure, scalable, and maintainable RBAC system with clear separation of concerns and comprehensive audit logging.

// Role-based access control utilities
export type UserRole = 'super_admin' | 'admin' | 'support' | 'user';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 4,
  admin: 3,
  support: 2,
  user: 1,
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'manage_admins',
    'manage_roles',
    'view_all_users',
    'view_audit_logs',
    'system_settings',
    'manage_permissions',
    'manage_users',
    'view_activity_logs',
    'manage_transactions',
    'generate_reports',
    'view_user_data',
    'help_users',
    'view_own_data',
    'edit_own_profile',
    'view_own_transactions',
  ],
  admin: [
    'manage_users',
    'view_activity_logs',
    'manage_transactions',
    'generate_reports',
    'view_user_data',
    'view_own_data',
    'edit_own_profile',
    'view_own_transactions',
  ],
  support: [
    'view_user_data',
    'help_users',
    'view_activity_logs',
    'view_own_data',
    'edit_own_profile',
    'view_own_transactions',
  ],
  user: [
    'view_own_data',
    'edit_own_profile',
    'view_own_transactions',
  ],
};

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  super_admin: '/dashboard/super-admin',
  admin: '/dashboard/admin',
  support: '/dashboard/support',
  user: '/dashboard/user',
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessRole(userRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
}

export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  support: 'Support Staff',
  user: 'Regular User',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-red-600',      // Ethiopian red
  admin: 'bg-amber-500',          // Ethiopian yellow
  support: 'bg-green-600',        // Ethiopian green
  user: 'bg-slate-500',
};

export const ROLE_TEXT_COLORS: Record<UserRole, string> = {
  super_admin: 'text-red-600',
  admin: 'text-amber-600',
  support: 'text-green-600',
  user: 'text-slate-600',
};

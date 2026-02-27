import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessRole(userRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
}

export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}

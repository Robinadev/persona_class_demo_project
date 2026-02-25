import { createClient } from '@supabase/supabase-js';
import type { UserRole } from './rbac';
import { ROLE_PERMISSIONS, ROLE_HIERARCHY } from './rbac';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Check if a user has a specific permission
 */
export async function checkUserPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    const role = profile.role as UserRole;
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Check if a user can access a specific role's resources
 */
export async function canAccessRole(
  userId: string,
  targetRole: UserRole
): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    const userRole = profile.role as UserRole;
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
  } catch (error) {
    console.error('Error checking role access:', error);
    return false;
  }
}

/**
 * Verify user role (for API routes)
 */
export async function verifyUserRole(
  userId: string,
  requiredRoles: UserRole[]
): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    return requiredRoles.includes(profile.role as UserRole);
  } catch (error) {
    console.error('Error verifying role:', error);
    return false;
  }
}

/**
 * Get user role
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return profile?.role as UserRole || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Check if user is admin or above
 */
export async function isAdminOrAbove(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin' || role === 'super_admin';
}

/**
 * Check if user is super admin
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'super_admin';
}

/**
 * Get user permissions
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const role = await getUserRole(userId);
    if (!role) return [];
    return ROLE_PERMISSIONS[role] || [];
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}

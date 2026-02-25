'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { hasPermission, canAccessRole, ROLE_HIERARCHY } from '@/lib/rbac';
import type { UserRole } from '@/lib/rbac';

export function useRole() {
  const { user } = useAuth();

  return {
    role: (user?.role as UserRole) || 'user',
    isSuperAdmin: user?.role === 'super_admin',
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSupport: user?.role === 'support' || user?.role === 'admin' || user?.role === 'super_admin',
    isUser: !!user,
    hasPermission: (permission: string) => hasPermission(user?.role as UserRole, permission),
    canAccess: (targetRole: UserRole) => canAccessRole(user?.role as UserRole, targetRole),
    roleLevel: user?.role ? ROLE_HIERARCHY[user.role as UserRole] : 0,
  };
}

export function useRequireRole(requiredRole: UserRole | UserRole[]) {
  const { user, loading } = useAuth();
  const { canAccess } = useRole();

  const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  return {
    hasAccess: required.some(role => canAccess(role)),
    isLoading: loading,
    user,
  };
}

export function useRequirePermission(permission: string | string[]) {
  const { user } = useAuth();
  const { hasPermission: checkPermission } = useRole();

  const permissions = Array.isArray(permission) ? permission : [permission];

  return {
    hasAccess: permissions.some(perm => checkPermission(perm)),
    user,
  };
}

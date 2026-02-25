'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { useRole } from '@/hooks/use-role';
import type { UserRole } from '@/lib/rbac';
import { useEffect } from 'react';

interface RoleGuardProps {
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: string | string[];
  fallbackUrl?: string;
  children: React.ReactNode;
}

export function RoleGuard({
  requiredRole,
  requiredPermission,
  fallbackUrl = '/dashboard/user',
  children,
}: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { canAccess, hasPermission } = useRole();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Check role requirement
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRole = roles.some(role => canAccess(role));

      if (!hasRole) {
        router.push(fallbackUrl);
        return;
      }
    }

    // Check permission requirement
    if (requiredPermission) {
      const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
      const hasRequiredPermission = permissions.some(perm => hasPermission(perm));

      if (!hasRequiredPermission) {
        router.push(fallbackUrl);
        return;
      }
    }
  }, [user, loading, requiredRole, requiredPermission, canAccess, hasPermission, fallbackUrl, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check if user has access
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRole = roles.some(role => canAccess(role));

    if (!hasRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page</p>
            <button
              onClick={() => router.push(fallbackUrl)}
              className="text-primary hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      );
    }
  }

  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    const hasRequiredPermission = permissions.some(perm => hasPermission(perm));

    if (!hasRequiredPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Permission Denied</h1>
            <p className="text-muted-foreground">You don't have the required permissions</p>
            <button
              onClick={() => router.push(fallbackUrl)}
              className="text-primary hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

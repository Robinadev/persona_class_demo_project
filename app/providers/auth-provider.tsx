'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { UserRole } from '@/lib/rbac';
import { getCurrentUser, signOut } from '@/lib/auth-service';

export interface AuthContextType {
  user: {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
    is_active: boolean;
    avatar_url?: string;
  } | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError('Failed to fetch user');
      console.error('Auth provider error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      setError('Failed to sign out');
      console.error('Sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signOut: handleSignOut,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

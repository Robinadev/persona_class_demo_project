import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminRole = 'super_admin' | 'admin';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
}

interface AuthStore {
  user: AdminUser | null;
  token: string | null;
  setUser: (user: AdminUser) => void;
  setToken: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
      setToken: (token) =>
        set({
          token,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'admin-auth-store',
      version: 1,
    }
  )
);

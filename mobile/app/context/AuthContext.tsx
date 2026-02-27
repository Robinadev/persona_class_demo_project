import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import * as SecureStore from 'expo-secure-store';

export type UserRole = 'super_admin' | 'admin' | 'support' | 'user';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, full_name: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await api.getToken();
      if (token) {
        const response = await api.getProfile();
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Bootstrap error:', error);
      await api.clearToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    full_name: string,
    role: UserRole = 'user'
  ) => {
    try {
      const response = await api.signup(email, password, full_name, role);
      // Don't set user here - they need to login first
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await api.updateProfile(data);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: user !== null,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

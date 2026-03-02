// app/dashboard/user/page.preview.tsx
import React from 'react';
import UserDashboard from './page';

// Define types outside the mock
interface MockUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  avatar_url: string;
}

interface MockAuthContextType {
  user: MockUser;
  loading: boolean;
  error: null;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

// Completely mock the auth provider module before importing it
jest.mock('@/app/providers/auth-provider', () => {
  const React = require('react');
  
  const mockUser = {
    id: 'preview-user',
    email: 'preview@example.com',
    full_name: 'Preview User',
    role: 'user',
    is_active: true,
    avatar_url: '',
  };

  const mockAuthValue = {
    user: mockUser,
    loading: false,
    error: null,
    signOut: async () => {},
    refetchUser: async () => {},
  };

  const MockAuthContext = React.createContext(mockAuthValue);

  return {
    useAuth: () => React.useContext(MockAuthContext),
    AuthProvider: ({ children }: { children: React.ReactNode }) => {
      return React.createElement(
        MockAuthContext.Provider,
        { value: mockAuthValue },
        children
      );
    },
  };
});

// Now import the dashboard after mocking

// Use both default and named exports
const Preview = () => {
  return <UserDashboard />;
};

export default Preview;
export const UserDashboardPreview = Preview;
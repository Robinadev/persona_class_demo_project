// preview-wrapper.tsx
'use client';

import React from 'react';

// Mock auth context
const MockAuthContext = React.createContext({
  user: {
    id: 'preview-user',
    email: 'preview@example.com',
    full_name: 'Preview User',
    role: 'user',
    is_active: true,
    avatar_url: '',
  },
  loading: false,
  error: null,
  signOut: async () => {},
  refetchUser: async () => {},
});

// The following mock is only for testing purposes and should not be used in production code.
// If you need to mock the auth-provider in tests, move this logic to your test files.

import { ReactNode } from 'react';

export function PreviewWrapper({ children }: { children: ReactNode }) {
  return (
    <MockAuthContext.Provider
      value={{
        user: {
          id: 'preview-user',
          email: 'preview@example.com',
          full_name: 'Preview User',
          role: 'user',
          is_active: true,
          avatar_url: '',
        },
        loading: false,
        error: null,
        signOut: async () => {},
        refetchUser: async () => {},
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}
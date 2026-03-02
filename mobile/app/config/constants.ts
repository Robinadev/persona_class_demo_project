import Constants from 'expo-constants';

const ENV = Constants.expoConfig?.extra;

export const API_URL = ENV?.apiUrl || 'http://localhost:3001/api';
export const SUPABASE_URL = ENV?.supabaseUrl || '';
export const SUPABASE_KEY = ENV?.supabaseKey || '';

export const COLORS = {
  primary: '#038E7D', // International Teal
  primaryHover: '#026B5E', // Darker Teal
  primaryActive: '#015248', // Even darker Teal
  secondary: '#E0F5F2', // Light Teal background
  tertiary: '#026B5E', // Dark Teal
  background: '#FFFFFF',
  foreground: '#1F2937',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  muted: '#6B7280',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  support: 'Support Staff',
  user: 'User',
};

export const ROLE_COLORS: Record<string, string> = {
  super_admin: '#038E7D',
  admin: '#026B5E',
  support: '#015248',
  user: '#9CA3AF',
};

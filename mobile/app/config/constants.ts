import Constants from 'expo-constants';

const ENV = Constants.expoConfig?.extra;

export const API_URL = ENV?.apiUrl || 'http://localhost:3001/api';
export const SUPABASE_URL = ENV?.supabaseUrl || '';
export const SUPABASE_KEY = ENV?.supabaseKey || '';

export const COLORS = {
  primary: '#CE1126', // Ethiopian red
  secondary: '#F4D03F', // Ethiopian yellow
  tertiary: '#078930', // Ethiopian green
  background: '#FFFFFF',
  foreground: '#000000',
  border: '#E5E7EB',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#EA8C55',
  info: '#3B82F6',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  support: 'Support Staff',
  user: 'User',
};

export const ROLE_COLORS: Record<string, string> = {
  super_admin: '#CE1126',
  admin: '#F4D03F',
  support: '#078930',
  user: '#9CA3AF',
};

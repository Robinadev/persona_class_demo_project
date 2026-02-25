import { createClient } from '@supabase/supabase-js';
import type { UserRole } from './rbac';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserWithRole {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  is_active: boolean;
  avatar_url?: string;
}

export async function getCurrentUser(): Promise<UserWithRole | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      full_name: profile?.full_name,
      role: profile?.role || 'user',
      is_active: profile?.is_active ?? true,
      avatar_url: profile?.avatar_url,
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) return null;
    return profile?.role || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      return false;
    }

    // Log this action in activity_logs
    await logActivity(userId, 'role_changed', 'user', userId, { new_role: newRole });
    
    return true;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return false;
  }
}

export async function createUserProfile(
  userId: string,
  email: string,
  fullName: string,
  role: UserRole = 'user'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error creating profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return false;
  }
}

export async function logActivity(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details || null,
        status: 'success',
        created_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export async function getActivityLogs(
  userId?: string,
  limit: number = 50
): Promise<any[]> {
  try {
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getActivityLogs:', error);
    return [];
  }
}

export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

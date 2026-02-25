import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/permissions';
import type { UserRole } from '@/lib/rbac';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    // Get the auth token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if requester is super admin
    const isAdmin = await isSuperAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only super admins can update user roles' },
        { status: 403 }
      );
    }

    // Get the request body
    const { targetUserId, newRole } = await request.json() as {
      targetUserId?: string;
      newRole?: UserRole;
    };

    if (!targetUserId || !newRole) {
      return NextResponse.json(
        { error: 'Missing targetUserId or newRole' },
        { status: 400 }
      );
    }

    // Validate the new role
    const validRoles: UserRole[] = ['super_admin', 'admin', 'support', 'user'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Update the user role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update user role', details: updateError.message },
        { status: 500 }
      );
    }

    // Log this action
    await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'user_role_updated',
        resource_type: 'user',
        resource_id: targetUserId,
        details: { new_role: newRole },
        status: 'success',
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      message: `User role updated to ${newRole}`,
      targetUserId,
      newRole,
    });
  } catch (error) {
    console.error('Update role error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

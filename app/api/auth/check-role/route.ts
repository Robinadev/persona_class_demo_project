import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { verifyUserRole } from '@/lib/permissions';
import type { UserRole } from '@/lib/rbac';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    // Get the auth token from headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', hasAccess: false },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token', hasAccess: false },
        { status: 401 }
      );
    }

    // Get the required roles from the request body
    const { requiredRoles } = await request.json() as { requiredRoles?: UserRole[] };

    if (!requiredRoles || requiredRoles.length === 0) {
      // If no specific roles required, just check if user is authenticated
      return NextResponse.json({
        authenticated: true,
        userId: user.id,
        hasAccess: true,
      });
    }

    // Verify user has one of the required roles
    const hasAccess = await verifyUserRole(user.id, requiredRoles);

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      hasAccess,
      requiredRoles,
    });
  } catch (error) {
    console.error('Role check error:', error);
    return NextResponse.json(
      { error: 'Internal server error', hasAccess: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', role: null },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token', role: null },
        { status: 401 }
      );
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found', role: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      role: profile.role,
      isActive: profile.is_active,
    });
  } catch (error) {
    console.error('Get role error:', error);
    return NextResponse.json(
      { error: 'Internal server error', role: null },
      { status: 500 }
    );
  }
}

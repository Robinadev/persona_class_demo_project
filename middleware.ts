import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { UserRole } from './lib/rbac'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/landing',
  '/login',
  '/signup',
  '/create-account',
  '/account/type-selection',
  '/support',
  '/admin/login',
  '/api/auth/callback',
]

// Routes by role
const roleRoutes: Record<UserRole, string[]> = {
  super_admin: ['/dashboard/super-admin', '/admin'],
  admin: ['/dashboard/admin', '/admin/users'],
  support: ['/dashboard/support'],
  user: ['/dashboard/user', '/profile'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get auth token from cookie
  const token = request.cookies.get('auth_session')?.value

  if (!token) {
    // Not authenticated - redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For dashboard routes, verify user role and redirect if necessary
  if (pathname.startsWith('/dashboard')) {
    try {
      // We can't fully verify role in middleware without making DB calls
      // This is handled by the client-side route guards and server components
      // Just allow the request to proceed, the page will handle auth
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware auth error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protected routes
  if (pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

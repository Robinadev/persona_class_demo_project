import { type NextRequest, NextResponse } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/landing',
  '/login',
  '/signup',
  '/api/admin/login',
  '/api/auth/callback',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for session cookie
  const session = request.cookies.get('auth_session')?.value
  const adminSession = request.cookies.get('admin_session')?.value

  // If accessing admin routes, check admin session
  if (pathname.startsWith('/admin')) {
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // If accessing protected user routes, check user session
  if (pathname.startsWith('/profile') || pathname.startsWith('/billing') || pathname.startsWith('/api')) {
    if (!session && !adminSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

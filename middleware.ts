import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.includes(pathname)

  // If accessing a public route, allow it
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    console.log('[Middleware] No token found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token (async for Edge runtime)
  const decoded = await verifyTokenEdge(token)
  
  if (!decoded) {
    console.log('[Middleware] Token invalid, redirecting to login')
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }

  console.log('[Middleware] Token valid, allowing access to', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}


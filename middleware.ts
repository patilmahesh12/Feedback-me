import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/login', '/register', '/'];
  
  // If accessing protected route
  if (!publicRoutes.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?error=unauthorized&message=Please login first`, request.url)
      );
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      
      // Add cache control for protected routes
      const response = NextResponse.next();
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    } catch (error) {
      // Clear invalid token and redirect
      const response = NextResponse.redirect(
        new URL('/login?error=invalid_token&message=Session expired', request.url)
      );
      response.cookies.delete('token');
      return response;
    }
  }

  // For public routes
  const response = NextResponse.next();
  if (pathname === '/login' || pathname === '/register') {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
// proxy.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './lib/auth';

// Routes that don't require authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/refresh',
  '/api/health',
  '/api/beta/signup',
  '/api/beta/join',
  '/api/admin/beta-signups',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for token in Authorization header
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Add user info to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', decoded.userId);
  requestHeaders.set('x-user-email', decoded.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/api/:path*',
};
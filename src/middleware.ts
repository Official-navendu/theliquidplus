import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. NEVER intercept, block, or protect Auth.js API endpoints
  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const reqId = crypto.randomUUID();
  const response = NextResponse.next();
  
  // Inject Request ID and Security Headers
  response.headers.set('X-Request-Id', reqId);
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  let token = null;
  try {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });
  } catch (err) {
    console.error('Middleware token error:', err);
  }

  const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].some(
    (route) => path === route || path.startsWith(route + '/')
  );

  const isProtectedRoute = ['/account', '/admin'].some(
    (route) => path === route || path.startsWith(route + '/')
  );

  // Redirect authenticated users away from guest-only auth pages
  if (isAuthRoute && token) {
    const userRole = token.role as string;
    const dest = (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') ? '/admin' : '/account';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Redirect guests away from protected pages
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // Admin access validation
  if (path.startsWith('/admin') && token) {
    const userRole = token.role as string;
    if (userRole === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  // Protect all routes except next statics, image rendering, favicon, and api/auth endpoints
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|assets).*)'],
};

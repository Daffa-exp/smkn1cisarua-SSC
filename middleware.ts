import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'ssc_auth_token';
const PUBLIC_ROUTES = ['/', '/login', '/api/auth/login', '/api/auth/logout', '/api/seed'];

// Bulletproof UTF-8 Safe Base64 JWT Payload Parser for Vercel Edge Runtime
function parseJWTPayload(token: string) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    let base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    // Safely decode Base64 UTF-8 string in Edge environment
    let jsonStr = '';
    if (typeof Buffer !== 'undefined') {
      jsonStr = Buffer.from(base64, 'base64').toString('utf-8');
    } else {
      jsonStr = decodeURIComponent(
        Array.from(atob(base64))
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    }

    const payload = JSON.parse(jsonStr);

    if (payload && payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Static assets, favicon, manifest, and internalNext bypass
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/icon') ||
      pathname.startsWith('/manifest') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    const user = token ? parseJWTPayload(token) : null;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // If going to /login while logged in, redirect to /dashboard
    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    // If trying to access protected route without login, redirect to /login
    if (!isPublicRoute && !user && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Admin route role authorization check
    if (pathname.startsWith('/admin')) {
      if (
        !user ||
        (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'STUDENT_LEADER')
      ) {
        return NextResponse.redirect(new URL('/unauthorized', request.nextUrl));
      }
    }

    return NextResponse.next();
  } catch (err) {
    // Fail-safe protection: allow request through if any edge error occurs
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

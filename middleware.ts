import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'ssc_auth_token';
const PUBLIC_ROUTES = ['/login', '/api/auth/login', '/api/auth/logout', '/api/seed'];

// Bulletproof Web Standard JWT Payload Parser
function parseJWTPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
    
    const jsonStr = atob(paddedBase64);
    const payload = JSON.parse(jsonStr);
    
    // Check expiration
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

    // Static assets & next internal routes bypass
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    const user = token ? parseJWTPayload(token) : null;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // If going to /login while logged in, redirect to /dashboard
    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If trying to access protected route without login, redirect to /login
    if (!isPublicRoute && !user && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admin route role authorization check (ADMIN, SUPER_ADMIN, STUDENT_LEADER / Ketos & Waketos)
    if (pathname.startsWith('/admin')) {
      if (
        !user ||
        (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'STUDENT_LEADER')
      ) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    // Fail-safe protection: prevent any middleware invocation failure 500 error
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

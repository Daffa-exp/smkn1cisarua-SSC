import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'ssc_auth_token';
const PUBLIC_ROUTES = ['/', '/login', '/api/auth/login', '/api/auth/logout', '/api/seed'];

async function getJwtSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function verifyJWTToken(token: string): Promise<any> {
  try {
    const secret = await getJwtSecret();
    if (!secret) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    const data = `${headerB64}.${payloadB64}`;
    const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    if (header.alg !== 'HS256') return null;

    const key = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const valid = await crypto.subtle.verify('HMAC', key, signature, new TextEncoder().encode(data));
    if (!valid) return null;

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && Date.now() >= payload.exp * 1000) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

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
    const user = token ? await verifyJWTToken(token) : null;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    if (!isPublicRoute && !user && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

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
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

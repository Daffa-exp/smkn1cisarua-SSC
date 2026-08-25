import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWTToken, COOKIE_NAME } from '@/lib/jwt';

const PUBLIC_ROUTES = ['/', '/login', '/api/auth/login', '/api/auth/logout', '/api/seed'];

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
    console.error('[MW-DEBUG] hasToken=', !!token, 'secret=', !!process.env.NEXTAUTH_SECRET);
    const user = token ? await verifyJWTToken(token) : null;
    console.error('[MW-DEBUG] user=', user ? user.role : null);

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

export const runtime = 'nodejs';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const adminToken = request.cookies.get('admin-session')?.value;

    // 1. If trying to access the login page
    if (pathname === '/admin/login') {
      if (adminToken) {
        // Already logged in, go to dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // 2. If trying to access any other /admin route
    if (pathname.startsWith('/admin')) {
      if (!adminToken) {
        // Not logged in, go to login
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware execution failed:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};

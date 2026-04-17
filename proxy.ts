import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const adminToken = request.cookies.get('admin-session')?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Let the login page pass, but redirect if already authenticated
  if (isAdminRoute && request.nextUrl.pathname === '/admin/login') {
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Block unauthorized access to any other /admin routes
  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Bare minimum to diagnostic 500 error
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

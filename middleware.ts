import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.has('token');
  if (
    pathname.startsWith('/ngo/register') ||
    pathname.startsWith('/ngo/sign-in')
  ) {
    return NextResponse.next();
  }

  // 🔒 Protect NGO routes
  if (pathname.startsWith('/ngo')) {
    if (!token) {
      return NextResponse.redirect(new URL('/ngo/sign-in', request.url));
    }

  }

  // 🔒 Protect payment/donation routes (example)
/*   if (pathname.includes('/donate')) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/donor/login?redirect=${pathname}`, request.url)
      );
    }
  } */

  return NextResponse.next();
}

export const config = {
  matcher: ['/ngo/:path*', '/campaigns/:path*/donate'],
};

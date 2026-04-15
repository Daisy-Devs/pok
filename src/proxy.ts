import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/ngo/:path*'], //TODO: add donate '/campaigns/:path*/donate'
};
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.has("token")||request.cookies.has("walletToken")||false;
  const isDonor = request.cookies.get("role")?.value=='Donor'||false;

  if (
    pathname.startsWith('/ngo/register') ||
    pathname.startsWith('/ngo/sign-in')
  ) {
    if (token && !isDonor) {
      return NextResponse.redirect(new URL('/ngo', request.url));
    }
    return NextResponse.next();
  }

  // 🔒 Protect NGO routes
  if (pathname.startsWith('/ngo')) {
    if(isDonor){
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (!token) {
      return NextResponse.redirect(new URL('/ngo/sign-in', request.url));
    }

  }
  // 🔒 Protect payment/donation routes
/*   if (pathname.includes('/donate')) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/sign-in`, request.url)
      );
    }
  } */

  return NextResponse.next();
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const config = {
  matcher: ["/ngo/:path*", "/profile", "/sign-in", "/register"], //TODO: add donate '/campaigns/:path*/donate'
};
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || "";
  const destructuredToken = token
    ? (jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as string)
    : "";
  const role = destructuredToken ? destructuredToken?.role : "";

  if (
    pathname.startsWith("/ngo/register") ||
    pathname.startsWith("/ngo/sign-in")
  ) {
    if (token && role == "ngo") {
      return NextResponse.redirect(new URL("/ngo", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/register")) {
    if (token && role === "donor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/profile")) {
    if (!token && role === "donor") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    if (token && role === "ngo") {
      return NextResponse.redirect(new URL("/ngo", request.url));
    }
    return NextResponse.next();
  }

  // 🔒 Protect NGO routes
  if (pathname.startsWith("/ngo")) {
    if (role === "donor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (!token) {
      return NextResponse.redirect(new URL("/ngo/sign-in", request.url));
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

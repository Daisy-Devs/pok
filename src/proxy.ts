import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type Token={
  name: string;
  email: string;
  role: string;
  id: string;
}
export const config = {
  matcher: ["/ngo/:path*", "/profile", "/sign-in", "/register"], //TODO: add donate '/campaigns/:path*/donate'
};
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const token = request.cookies.get("token")?.value || "";
  // const destructuredToken = token
  //   ? (jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as Token)
  //   : null;
  const role = request.cookies.get("role")?.value || "";
  // console.log("pfffttt",token);
  console.log("pfffttt",role);
    console.log("===== MIDDLEWARE =====");
  console.log("URL:", request.nextUrl.pathname);
  console.log("COOKIE HEADER:", request.headers.get("cookie"));
  console.log(
    "TOKEN:",
    request.cookies.get("token")?.value
  );
  if (
    pathname.startsWith("/ngo/register") ||
    pathname.startsWith("/ngo/sign-in")
  ) {
    if (role == "ngo") {
      return NextResponse.redirect(new URL("/ngo", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/register")) {
    if (role === "donor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/profile")) {
    if (!role) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    if (role === "ngo") {
      return NextResponse.redirect(new URL("/ngo", request.url));
    }
    return NextResponse.next();
  }

  // 🔒 Protect NGO routes
  if (pathname.startsWith("/ngo")) {
    if (role === "donor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (!role) {
      return NextResponse.redirect(new URL("/ngo/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

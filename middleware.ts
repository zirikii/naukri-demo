import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, decodeSession } from "@/lib/auth/session";

/** Route prefixes that require an authenticated session. */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/profile",
  "/applied",
  "/saved",
  "/messages",
  "/recommendations",
  "/naukri-360",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decodeSession(token);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/applied/:path*",
    "/saved/:path*",
    "/messages/:path*",
    "/recommendations/:path*",
    "/naukri-360/:path*",
    "/settings/:path*",
  ],
};

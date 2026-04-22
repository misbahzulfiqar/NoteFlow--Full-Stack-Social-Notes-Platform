import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isAuthPage = (p: string) => p === "/login" || p === "/register";
const isProtected = (p: string) =>
  p === "/feed" ||
  p.startsWith("/notes") ||
  p.startsWith("/favorites") ||
  p.startsWith("/profile");

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const loggedIn = !!req.cookies.get("refreshToken")?.value;

  if (p === "/") {
    return NextResponse.redirect(new URL(loggedIn ? "/feed" : "/login", req.url));
  }

  if (isAuthPage(p) && loggedIn) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  if (isProtected(p) && !loggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
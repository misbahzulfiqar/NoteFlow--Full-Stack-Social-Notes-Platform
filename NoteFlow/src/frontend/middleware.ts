// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// const isAuthPage = (p: string) => p === "/login" || p === "/register";
// const isProtected = (p: string) =>
//   p === "/feed" ||
//   p.startsWith("/notes") ||
//   p.startsWith("/favorites") ||
//   p.startsWith("/profile");

// export function middleware(req: NextRequest) {
//   try {
//     const p = req.nextUrl.pathname;
//     const loggedIn = !!req.cookies.get("refreshToken")?.value;

//     if (p === "/") {
//       const nextUrl = req.nextUrl.clone();
//       nextUrl.pathname = loggedIn ? "/feed" : "/login";
//       return NextResponse.redirect(nextUrl);
//     }

//     if (isAuthPage(p) && loggedIn) {
//       const nextUrl = req.nextUrl.clone();
//       nextUrl.pathname = "/feed";
//       return NextResponse.redirect(nextUrl);
//     }

//     if (isProtected(p) && !loggedIn) {
//       const nextUrl = req.nextUrl.clone();
//       nextUrl.pathname = "/login";
//       return NextResponse.redirect(nextUrl);
//     }
//   } catch {
//     // Never crash middleware in production; allow request through.
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
// };

export function middleware() {
  return NextResponse.next();
}
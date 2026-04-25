import type { NextResponse } from "next/server";

const maxAgeSeconds = 60 * 60 * 24 * 7;

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setRefreshTokenCookie(res: NextResponse, refreshToken: string) {
  res.cookies.set("refreshToken", refreshToken, {
    ...base,
    maxAge: maxAgeSeconds,
  });
}

export function clearRefreshTokenCookie(res: NextResponse) {
  res.cookies.set("refreshToken", "", {
    ...base,
    maxAge: 0,
  });
}

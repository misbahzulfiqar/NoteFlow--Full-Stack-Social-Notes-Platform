import { NextResponse } from "next/server";
import { clearRefreshTokenCookie } from "@/lib/server/auth/refreshCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearRefreshTokenCookie(res);
  return res;
}

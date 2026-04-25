import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectMongo } from "@/lib/server/mongo";
import { refreshSession } from "@/lib/server/auth/auth.service";
import { setRefreshTokenCookie } from "@/lib/server/auth/refreshCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await connectMongo();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database configuration error";
    return NextResponse.json({ message }, { status: 500 });
  }

  const cookieStore = await cookies();
  const oldRefreshToken = cookieStore.get("refreshToken")?.value;
  if (!oldRefreshToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { accessToken, refreshToken, user } = await refreshSession(oldRefreshToken);
    const res = NextResponse.json({ accessToken, user });
    setRefreshTokenCookie(res, refreshToken);
    return res;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

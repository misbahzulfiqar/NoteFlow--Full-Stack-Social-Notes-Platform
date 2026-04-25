import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { loginSchema } from "@/lib/server/auth/auth.validation";
import { loginUser } from "@/lib/server/auth/auth.service";
import { setRefreshTokenCookie } from "@/lib/server/auth/refreshCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectMongo();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database configuration error";
    return NextResponse.json({ message }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const { user, accessToken, refreshToken } = await loginUser(parsed.data);
    const res = NextResponse.json({
      message: "Logged in successfully",
      user,
      accessToken,
    });
    setRefreshTokenCookie(res, refreshToken);
    return res;
  } catch {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
}

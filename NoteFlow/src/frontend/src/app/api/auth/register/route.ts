import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { registerSchema } from "@/lib/server/auth/auth.validation";
import { registerUser } from "@/lib/server/auth/auth.service";
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

  const parsed = registerSchema.safeParse(body);
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
    const { user, accessToken, refreshToken } = await registerUser(parsed.data);
    const res = NextResponse.json(
      {
        message: "Registered successfully",
        user,
        accessToken,
      },
      { status: 201 },
    );
    setRefreshTokenCookie(res, refreshToken);
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}

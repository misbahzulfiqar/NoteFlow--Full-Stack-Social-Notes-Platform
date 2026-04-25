import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { resetPasswordSchema } from "@/lib/server/auth/auth.validation";
import { resetPasswordWithToken } from "@/lib/server/auth/passwordReset.service";

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

  const parsed = resetPasswordSchema.safeParse(body);
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
    await resetPasswordWithToken(parsed.data.token, parsed.data.password);
    return NextResponse.json({ message: "Password reset successfully" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to reset password";
    return NextResponse.json({ message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { forgotPasswordSchema } from "@/lib/server/auth/auth.validation";
import { createPasswordResetRequest } from "@/lib/server/auth/passwordReset.service";

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

  const parsed = forgotPasswordSchema.safeParse(body);
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
    const result = await createPasswordResetRequest(parsed.data.email, req);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to start password reset";
    return NextResponse.json({ message }, { status: 400 });
  }
}

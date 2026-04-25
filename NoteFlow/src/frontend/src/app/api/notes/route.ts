import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { verifyAccessToken } from "@/lib/server/auth/verifyAccessToken";
import { createNoteSchema } from "@/lib/server/notes/notes.validation";
import { createNote, getOwnNotes } from "@/lib/server/notes/notes.service";
import { parseListQueryFromUrl } from "@/lib/server/notes/notes.query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = verifyAccessToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectMongo();
    const url = new URL(req.url);
    const data = await getOwnNotes(user.id, parseListQueryFromUrl(url.searchParams));
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to fetch notes" },
      { status: 400 },
    );
  }
}

export async function POST(req: Request) {
  const user = verifyAccessToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  try {
    await connectMongo();
    const note = await createNote(user.id, parsed.data);
    return NextResponse.json({ message: "Note created", note }, { status: 201 });
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : (e as { message?: string })?.message || "Failed to create note";
    return NextResponse.json({ message }, { status: 400 });
  }
}

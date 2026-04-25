import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { verifyAccessToken } from "@/lib/server/auth/verifyAccessToken";
import { updateNoteSchema } from "@/lib/server/notes/notes.validation";
import { deleteNote, getOwnNoteById, updateNote } from "@/lib/server/notes/notes.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = verifyAccessToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectMongo();
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }
    const note = await getOwnNoteById(user.id, id);
    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }
    return NextResponse.json({ note });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to fetch note" },
      { status: 400 },
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
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
  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  try {
    await connectMongo();
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }
    const note = await updateNote(user.id, id, parsed.data);
    return NextResponse.json({ message: "Note updated", note });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to update note" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = verifyAccessToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectMongo();
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }
    await deleteNote(user.id, id);
    return NextResponse.json({ message: "Note deleted" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete note";
    const status = msg === "Note not found" ? 404 : 400;
    return NextResponse.json({ message: msg }, { status });
  }
}

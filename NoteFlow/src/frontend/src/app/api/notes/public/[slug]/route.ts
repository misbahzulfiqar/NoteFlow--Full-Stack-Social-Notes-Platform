import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { getPublicNoteBySlug } from "@/lib/server/notes/notes.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    await connectMongo();
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ message: "Invalid slug" }, { status: 400 });
    }
    const note = await getPublicNoteBySlug(slug);
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

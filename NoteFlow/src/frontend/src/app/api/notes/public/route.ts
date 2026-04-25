import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { getPublicNotes } from "@/lib/server/notes/notes.service";
import { parseListQueryFromUrl } from "@/lib/server/notes/notes.query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectMongo();
    const url = new URL(req.url);
    const data = await getPublicNotes(parseListQueryFromUrl(url.searchParams));
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to fetch public notes" },
      { status: 400 },
    );
  }
}

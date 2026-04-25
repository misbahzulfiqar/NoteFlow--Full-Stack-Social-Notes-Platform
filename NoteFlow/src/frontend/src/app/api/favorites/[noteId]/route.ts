import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { verifyAccessToken } from "@/lib/server/auth/verifyAccessToken";
import { addFavorite, removeFavorite } from "@/lib/server/favorites/favorites.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  context: { params: Promise<{ noteId: string }> },
) {
  const user = verifyAccessToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectMongo();
    const { noteId } = await context.params;
    if (!noteId) {
      return NextResponse.json({ message: "Invalid note id param" }, { status: 400 });
    }
    const result = await addFavorite(user.id, noteId);
    return NextResponse.json(
      {
        message: result.alreadyFavorited ? "Already in favorites" : "Added to favorites",
        alreadyFavorited: result.alreadyFavorited,
      },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to add favorite" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ noteId: string }> },
) {
  const user = verifyAccessToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectMongo();
    const { noteId } = await context.params;
    if (!noteId) {
      return NextResponse.json({ message: "Invalid note id param" }, { status: 400 });
    }
    await removeFavorite(user.id, noteId);
    return NextResponse.json({ message: "Removed from favorites" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to remove";
    const status = msg === "Favorite not found" ? 404 : 400;
    return NextResponse.json({ message: msg }, { status });
  }
}

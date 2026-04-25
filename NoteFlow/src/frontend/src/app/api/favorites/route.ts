import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { verifyAccessToken } from "@/lib/server/auth/verifyAccessToken";
import { listFavorites } from "@/lib/server/favorites/favorites.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseListQuery(url: URL) {
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 12);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 12,
  };
}

export async function GET(req: Request) {
  const user = verifyAccessToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectMongo();
    const url = new URL(req.url);
    const data = await listFavorites(user.id, parseListQuery(url));
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Failed to load favorites" },
      { status: 400 },
    );
  }
}

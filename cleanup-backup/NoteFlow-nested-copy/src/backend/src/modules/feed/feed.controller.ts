import type { Request, Response } from "express";
import {
  getPublicNoteBySlug,
  getPublicNotes,
  toggleNoteLike,
} from "../notes/notes.service";

function getSingleParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseFeedListQuery(req: Request) {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 12);
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const tag = typeof req.query.tag === "string" ? req.query.tag : undefined;
  const sortRaw = req.query.sort;
  const sort: "recent" | "oldest" | "popular" =
    sortRaw === "oldest"
      ? "oldest"
      : sortRaw === "popular"
        ? "popular"
        : "recent";
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 12,
    search,
    tag,
    sort,
  };
}

export async function getFeedController(req: Request, res: Response) {
  try {
    const data = await getPublicNotes(parseFeedListQuery(req));
    return res.json(data);
  } catch (e) {
    return res.status(400).json({
      message: e instanceof Error ? e.message : "Failed to fetch feed",
    });
  }
}

export async function getFeedNoteBySlugController(req: Request, res: Response) {
  try {
    const slug = getSingleParam(req.params.slug);
    if (!slug) return res.status(400).json({ message: "Invalid slug param" });
    const note = await getPublicNoteBySlug(slug);
    if (!note) return res.status(404).json({ message: "Note not found" });
    return res.json({ note });
  } catch (e) {
    return res.status(400).json({
      message: e instanceof Error ? e.message : "Failed to fetch note",
    });
  }
}

export async function postFeedLikeController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const id = getSingleParam(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid note id param" });
    const result = await toggleNoteLike(id, req.user.id);
    return res.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to toggle like";
    const status = msg === "Note not found" ? 404 : 400;
    return res.status(status).json({ message: msg });
  }
}

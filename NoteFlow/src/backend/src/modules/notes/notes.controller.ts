import type { Request, Response } from "express";
import { createNoteSchema } from "./notes.validation";
import { uploadImageBuffer } from "../../services/cloudinary.service";
import {
  createNote,
  getOwnNoteById,
  getOwnNotes,
  getPublicNoteBySlug,
  getPublicNotes,
  updateNoteCover,
} from "./notes.service";

export async function createNoteController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parsed = createNoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const note = await createNote(req.user.id, parsed.data);
    return res.status(201).json({ message: "Note created", note });
  } catch (e) {
    console.error("[patchNoteCover] error:", e);
    const message =
      e instanceof Error
        ? e.message
        : (e as { message?: string })?.message || "Upload failed";
    return res.status(400).json({ message });
  }
}

export async function patchNoteCoverController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  const file = req.file;
  if (!file?.buffer) return res.status(400).json({ message: "No file uploaded" });
  try {
    const url = await uploadImageBuffer(file.buffer, "noteflow/covers");
    const note = await updateNoteCover(req.user.id, id, url);
    return res.json({ message: "Cover updated", note });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e instanceof Error ? e.message : "Upload failed" });
  }
}

function parseListQuery(req: Request) {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 12);
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const tag = typeof req.query.tag === "string" ? req.query.tag : undefined;
  const sort =
    req.query.sort === "oldest" || req.query.sort === "recent"
      ? req.query.sort
      : "recent";
    const visibility =
    req.query.visibility === "public" || req.query.visibility === "private"
      ? req.query.visibility
      : undefined;
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 12,
    search,
    tag,
    sort,
    visibility,
  };
}
export async function getPublicNotesController(req: Request, res: Response) {
  try {
    const data = await getPublicNotes(parseListQuery(req));
    return res.json(data);
  } catch (e) {
    return res
      .status(400)
      .json({ message: e instanceof Error ? e.message : "Failed to fetch public notes" });
  }
}
export async function getPublicNoteBySlugController(req: Request, res: Response) {
  try {
    const note = await getPublicNoteBySlug(req.params.slug);
    if (!note) return res.status(404).json({ message: "Note not found" });
    return res.json({ note });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e instanceof Error ? e.message : "Failed to fetch note" });
  }
}
export async function getOwnNotesController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const data = await getOwnNotes(req.user.id, parseListQuery(req));
    return res.json(data);
  } catch (e) {
    return res
      .status(400)
      .json({ message: e instanceof Error ? e.message : "Failed to fetch notes" });
  }
}
export async function getOwnNoteByIdController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const note = await getOwnNoteById(req.user.id, req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    return res.json({ note });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e instanceof Error ? e.message : "Failed to fetch note" });
  }
}


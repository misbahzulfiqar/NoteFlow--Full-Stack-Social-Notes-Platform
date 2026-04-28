import type { Request, Response } from "express";
import { createNoteSchema, updateNoteSchema } from "./notes.validation";
import { uploadImageBuffer } from "../../services/cloudinary.service";
import {
  createNote,
  deleteNote,
  getOwnNoteById,
  getOwnNotes,
  updateNote,
  updateNoteCover,
} from "./notes.service";

function getSingleParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

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
    console.error("[createNote] error:", e);
    const message =
      e instanceof Error
        ? e.message
        : (e as { message?: string })?.message || "Failed to create note";
    return res.status(400).json({ message });
  }

}

export async function patchNoteCoverController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const id = getSingleParam(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid note id param" });  const file = req.file;
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
  const sort: "recent" | "oldest" | "popular" =
    req.query.sort === "oldest"
      ? "oldest"
      : req.query.sort === "popular"
        ? "popular"
        : "recent";
const visibility: "public" | "private" | undefined =
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
    const id = getSingleParam(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid note id param" });
    const note = await getOwnNoteById(req.user.id, id);    if (!note) return res.status(404).json({ message: "Note not found" });
    return res.json({ note });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e instanceof Error ? e.message : "Failed to fetch note" });
  }
}
export async function updateNoteController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const parsed = updateNoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const id = getSingleParam(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid note id param" });
    const note = await updateNote(req.user.id, id, parsed.data);    return res.json({ message: "Note updated", note });
  } catch (e) {
    return res.status(400).json({
      message: e instanceof Error ? e.message : "Failed to update note",
    });
  }
}

export async function deleteNoteController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const id = getSingleParam(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid note id param" });
    await deleteNote(req.user.id, id);    return res.json({ message: "Note deleted" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete note";
    const status = msg === "Note not found" ? 404 : 400;
    return res.status(status).json({ message: msg });
  }
}

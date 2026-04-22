import type { Request, Response } from "express";
import { createNoteSchema } from "./notes.validation";
import { createNote, updateNoteCover  } from "./notes.service";
import { uploadImageBuffer } from "../../services/cloudinary.service";


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
  const file = req.file; // from multer
  if (!file?.buffer) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const url = await uploadImageBuffer(file.buffer, "noteflow/covers");
    const note = await updateNoteCover(req.user.id, id, url); // service: ownership check + save URL
    return res.json({ message: "Cover updated", note });
  } catch (e) {
    return res.status(400).json({ message: e instanceof Error ? e.message : "Upload failed" });
  }
}


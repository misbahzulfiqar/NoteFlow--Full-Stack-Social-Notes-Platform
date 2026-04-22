import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { createNoteController } from "./notes.controller";
import { upload } from "../../middleware/upload.middleware";
import { 
  createNoteController,
  getOwnNoteByIdController,
  getOwnNotesController,
  getPublicNoteBySlugController,
  getPublicNotesController,
  patchNoteCoverController,

 } from "./notes.controller";

const router = Router();

// Public endpoints
router.get("/public", getPublicNotesController);
router.get("/public/:slug", getPublicNoteBySlugController);

router.get("/", requireAuth, getOwnNotesController);
router.get("/:id", requireAuth, getOwnNoteByIdController);
router.post("/", requireAuth, createNoteController);
router.patch("/:id/cover", requireAuth, upload.single("cover"), patchNoteCoverController);
export default router;

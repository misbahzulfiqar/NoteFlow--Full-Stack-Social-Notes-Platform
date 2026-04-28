import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";
import {
  createNoteController,
  deleteNoteController,
  getOwnNoteByIdController,
  getOwnNotesController,
  patchNoteCoverController,
  updateNoteController,
} from "./notes.controller";

const router = Router();

router.get("/", requireAuth, getOwnNotesController);
router.post("/", requireAuth, createNoteController);

router.patch(
  "/:id/cover",
  requireAuth,
  upload.single("cover"),
  patchNoteCoverController,
);
router.put("/:id", requireAuth, updateNoteController);
router.delete("/:id", requireAuth, deleteNoteController);

router.get("/:id", requireAuth, getOwnNoteByIdController);

export default router;
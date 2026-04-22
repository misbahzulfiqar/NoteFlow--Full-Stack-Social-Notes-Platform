import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { createNoteController } from "./notes.controller";
import { upload } from "../../middleware/upload.middleware";
import { patchNoteCoverController } from "./notes.controller";

const router = Router();

router.post("/", requireAuth, createNoteController);
router.patch(
    "/:id/cover",
    requireAuth,
    upload.single("cover"), // field name must match frontend FormData key "cover"
    patchNoteCoverController
  );
export default router;
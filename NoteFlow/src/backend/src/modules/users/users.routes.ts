import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";
import { patchProfileController } from "./users.controller";

const router = Router();

router.patch(
  "/profile",
  requireAuth,
  upload.single("avatar"),
  patchProfileController
);

export default router;
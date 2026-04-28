import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  getFeedController,
  getFeedNoteBySlugController,
  postFeedLikeController,
} from "./feed.controller";

const router = Router();

router.get("/", getFeedController);
router.post("/:id/like", requireAuth, postFeedLikeController);
router.get("/:slug", getFeedNoteBySlugController);

export default router;

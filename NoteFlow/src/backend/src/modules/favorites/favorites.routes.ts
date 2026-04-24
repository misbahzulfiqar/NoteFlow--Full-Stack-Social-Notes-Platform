import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  addFavoriteController,
  getFavoritesController,
  removeFavoriteController,
} from "./favorites.controller";

const router = Router();

router.get("/", requireAuth, getFavoritesController);
router.post("/:noteId", requireAuth, addFavoriteController);
router.delete("/:noteId", requireAuth, removeFavoriteController);

export default router;
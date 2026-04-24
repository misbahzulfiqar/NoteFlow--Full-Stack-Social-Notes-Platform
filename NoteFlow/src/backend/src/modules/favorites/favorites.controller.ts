import type { Request, Response } from "express";
import {
  addFavorite,
  listFavorites,
  removeFavorite,
} from "../../services/favorites.service";

function parseListQuery(req: Request) {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 12);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 12,
  };
}

export async function getFavoritesController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const data = await listFavorites(req.user.id, parseListQuery(req));
    return res.json(data);
  } catch (e) {
    return res.status(400).json({
      message: e instanceof Error ? e.message : "Failed to load favorites",
    });
  }
}

export async function addFavoriteController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const result = await addFavorite(req.user.id, req.params.noteId);
    return res.status(201).json({
      message:
        result.alreadyFavorited ? "Already in favorites" : "Added to favorites",
      alreadyFavorited: result.alreadyFavorited,
    });
  } catch (e) {
    return res.status(400).json({
      message: e instanceof Error ? e.message : "Failed to add favorite",
    });
  }
}

export async function removeFavoriteController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    await removeFavorite(req.user.id, req.params.noteId);
    return res.json({ message: "Removed from favorites" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to remove";
    const status = msg === "Favorite not found" ? 404 : 400;
    return res.status(status).json({ message: msg });
  }
}
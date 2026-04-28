import { apiClient } from "@/lib/apiClient";
import type { Note } from "@/app/features/notes/types";

export type FavoritesListResponse = {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
};

export async function getFavorites(params: {
  page?: number;
  limit?: number;
} = {}): Promise<FavoritesListResponse> {
  const res = await apiClient.get<FavoritesListResponse>("/favorites", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 12,
    },
  });
  return res.data;
}

export async function addFavorite(noteId: string): Promise<void> {
  await apiClient.post(`/favorites/${noteId}`);
}

export async function removeFavorite(noteId: string): Promise<void> {
  await apiClient.delete(`/favorites/${noteId}`);
}
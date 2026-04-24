"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "@/app/features/favourites/services/favorite.services";

export function useAddFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => addFavorite(noteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => removeFavorite(noteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
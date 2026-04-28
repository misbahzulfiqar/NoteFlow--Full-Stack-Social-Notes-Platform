"use client";

import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/app/features/favourites/services/favorite.services";

export function useFavorites(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["favorites", params],
    queryFn: () => getFavorites(params),
  });
}
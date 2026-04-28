"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyNotes } from "../services/notes.service";

type Params = {
  search?: string;
  tag?: string;
  sort?: "recent" | "oldest" | "popular";
  page?: number;
  limit?: number;
  visibility?: "public" | "private";
};

export function useMyPublicNotes(params: Params = {}) {
  return useQuery({
    queryKey: ["notes", "mine", "public", params],
    queryFn: () => getMyNotes({ ...params, visibility: "public" }),
  });
}
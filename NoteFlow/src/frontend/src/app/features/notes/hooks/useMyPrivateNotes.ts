"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyNotes } from "../services/notes.service";

type Params = {
  search?: string;
  tag?: string;
  sort?: "recent" | "oldest";
  page?: number;
  limit?: number;
};

export function useMyPrivateNotes(params: Params = {}) {
  return useQuery({
    queryKey: ["notes", "mine", "private", params],
    queryFn: () => getMyNotes({ ...params, visibility: "private" }),
  });
}
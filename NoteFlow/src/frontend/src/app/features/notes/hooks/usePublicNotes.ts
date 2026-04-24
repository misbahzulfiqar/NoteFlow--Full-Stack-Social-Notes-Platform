// usePublicNotes.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicNotes, type ListParams } from "../services/notes.service";

export function usePublicNotes(params: ListParams) {
  return useQuery({
    queryKey: ["notes", "public", params],
    queryFn: () => getPublicNotes(params),
  });
}
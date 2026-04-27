"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicNoteBySlug } from "../services/notes.service";

export function usePublicNoteBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["feed", "note", slug],
    queryFn: () => getPublicNoteBySlug(slug!),
    enabled: Boolean(slug),
  });
}

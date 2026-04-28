"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicNotes, type GetPublicNotesParams } from "../services/notes.service";

export function usePublicNotes(params: GetPublicNotesParams) {
  return useQuery({
    queryKey: ["feed", params],
    queryFn: () => getPublicNotes(params),
  });
}
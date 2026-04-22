// useMyNotes.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyNotes, type ListParams } from "../services/notes.service";

export function useMyNotes(params: ListParams = {}) {
  return useQuery({
    queryKey: ["notes", "mine", params],
    queryFn: () => getMyNotes(params),
  });
}
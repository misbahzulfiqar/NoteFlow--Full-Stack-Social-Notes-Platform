"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyNoteById } from "../services/notes.service";

export function useMyNotes(noteId: string | undefined) {
  return useQuery({
    queryKey: ["notes", "mine", "one", noteId],
    queryFn: () => getMyNoteById(noteId!),
    enabled: Boolean(noteId),
  });
}
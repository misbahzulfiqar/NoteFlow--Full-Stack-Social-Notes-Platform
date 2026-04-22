"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { createNote, type CreateNotePayload } from "../services/notes.service";

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
    },
  });
}
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/getErrorMessage";
import {
  updateNote,
  type UpdateNotePayload,
} from "../services/notes.service";

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateNotePayload;
    }) => updateNote(id, payload),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ["notes", "mine"] });
      await queryClient.invalidateQueries({
        queryKey: ["notes", "mine", "one", id],
      });
      await queryClient.invalidateQueries({ queryKey: ["notes", "public"] });
    },
    onError: (error) => {
      console.error(getErrorMessage(error));
    },
  });
}
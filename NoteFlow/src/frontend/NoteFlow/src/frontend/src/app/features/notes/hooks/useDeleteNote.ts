"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { deleteNote } from "../services/notes.service";

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: async (_, id) => {
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
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFeedNoteLike } from "../services/notes.service";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useToggleFeedLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => toggleFeedNoteLike(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (err) => {
      console.error(getErrorMessage(err));
    },
  });
}

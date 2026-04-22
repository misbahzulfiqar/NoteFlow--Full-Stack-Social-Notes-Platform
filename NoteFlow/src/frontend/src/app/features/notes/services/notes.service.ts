import { apiClient } from "@/lib/apiClient";
import type { CreateNoteResponse, NoteVisibility } from "../types";

export type CreateNotePayload = {
  title: string;
  content: string;
  tags: string[];
  visibility: NoteVisibility;
};

export async function createNote(payload: CreateNotePayload): Promise<CreateNoteResponse> {
  const res = await apiClient.post<CreateNoteResponse>("/notes", payload);
  return res.data;
}

export async function uploadNoteCover(noteId: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("cover", file);
  await apiClient.patch(`/notes/${noteId}/cover`, formData);
}
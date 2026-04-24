import { apiClient } from "@/lib/apiClient";
import type { CreateNoteResponse, Note, NoteVisibility } from "../types";

export type ListParams = {
  search?: string;
  tag?: string;
  sort?: "recent" | "oldest";
  page?: number;
  limit?: number;
  visibility?: "public" | "private";
};

export type ListResponse = {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
};

export type SingleNoteResponse = { note: Note };


export type CreateNotePayload = {
  title: string;
  content: string;
  tags: string[];
  visibility: NoteVisibility;
};

export type GetPublicNotesParams = {
  search?: string;
  tag?: string;
  sort?: "recent" | "oldest";
  page?: number;
  limit?: number;
};

export type GetPublicNotesResponse = {
  message?: string;
  notes: Note[];
  total?: number;
  page?: number;
  limit?: number;
};

export type UpdateNotePayload = Partial<CreateNotePayload>;

export async function updateNote(
  id: string,
  payload: UpdateNotePayload,
): Promise<CreateNoteResponse> {
  const res = await apiClient.put<CreateNoteResponse>(`/notes/${id}`, payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<void> {
  await apiClient.delete(`/notes/${id}`);
}

export async function createNote(payload: CreateNotePayload): Promise<CreateNoteResponse> {
  const res = await apiClient.post<CreateNoteResponse>("/notes", payload);
  return res.data;
}

export async function uploadNoteCover(noteId: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("cover", file);
  await apiClient.patch(`/notes/${noteId}/cover`, formData);
}

export async function getPublicNotes(params: GetPublicNotesParams = {}): Promise<GetPublicNotesResponse> {
  const res = await apiClient.get<GetPublicNotesResponse>("/notes/public", {
    params: {
      search: params.search,
      tag: params.tag,
      sort: params.sort ?? "recent",
      page: params.page ?? 1,
      limit: params.limit ?? 12,
    },
  });
  return res.data;
}

export async function getMyNotes(params: ListParams = {}): Promise<ListResponse> {
  const res = await apiClient.get<ListResponse>("/notes", {
    params: {
      search: params.search,
      tag: params.tag,
      sort: params.sort ?? "recent",
      page: params.page ?? 1,
      limit: params.limit ?? 12,
      visibility: params.visibility,
    },
  });
  return res.data;
}

export async function getPublicNoteBySlug(slug: string): Promise<SingleNoteResponse> {
  const res = await apiClient.get<SingleNoteResponse>(`/notes/public/${slug}`);
  return res.data;
}

export async function getMyNoteById(id: string): Promise<SingleNoteResponse> {
  const res = await apiClient.get<SingleNoteResponse>(`/notes/${id}`);
  return res.data;
}
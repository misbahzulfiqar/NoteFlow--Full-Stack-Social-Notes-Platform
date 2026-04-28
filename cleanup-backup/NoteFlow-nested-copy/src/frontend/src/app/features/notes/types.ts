export type NoteVisibility = "public" | "private";

export type Note = {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  coverImage: string | null;
  visibility: NoteVisibility;  
  likesCount: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteResponse = {
  message: string;
  note: Note;
};
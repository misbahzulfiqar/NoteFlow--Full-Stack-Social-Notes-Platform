import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().max(200_000).optional().default(""),
  tags: z.array(z.string().trim().min(1).max(48)).max(30).optional().default([]),
  visibility: z.enum(["public", "private"]).optional().default("private"),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
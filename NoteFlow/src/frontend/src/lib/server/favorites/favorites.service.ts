import { Types } from "mongoose";
import { FavoriteModel } from "@/lib/server/models/Favorite.model";
import { NoteModel } from "@/lib/server/models/Note.model";
import type { NoteResponse } from "@/lib/server/notes/notes.service";

function toNoteResponse(doc: {
  _id: { toString(): string };
  title: string;
  content: string;
  slug: string;
  tags: string[];
  coverImage?: string | null;
  visibility: "public" | "private";
  likes?: { length: number };
  owner: { toString(): string };
  createdAt: Date;
  updatedAt: Date;
}): NoteResponse {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    slug: doc.slug,
    tags: doc.tags,
    coverImage: doc.coverImage ?? null,
    visibility: doc.visibility,
    likesCount: doc.likes?.length ?? 0,
    ownerId: doc.owner.toString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

type ListParams = { page: number; limit: number };

export async function listFavorites(userId: string, params: ListParams) {
  const skip = (params.page - 1) * params.limit;
  const filter = { userId: new Types.ObjectId(userId) };

  const [favs, total] = await Promise.all([
    FavoriteModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(params.limit)
      .populate<{ noteId: unknown }>({ path: "noteId", model: "Note" })
      .lean(),
    FavoriteModel.countDocuments(filter),
  ]);

  const notes: NoteResponse[] = [];
  for (const f of favs) {
    const n = f.noteId as Record<string, unknown> | null;
    if (!n || !n._id) continue;
    if (n.visibility !== "public") continue;
    notes.push(toNoteResponse(n as Parameters<typeof toNoteResponse>[0]));
  }

  return {
    notes,
    total,
    page: params.page,
    limit: params.limit,
  };
}

export async function addFavorite(userId: string, noteId: string) {
  if (!Types.ObjectId.isValid(noteId)) {
    throw new Error("Invalid note id");
  }

  const note = await NoteModel.findOne({
    _id: noteId,
    visibility: "public",
  }).lean();

  if (!note) {
    throw new Error("Note not found or not public");
  }

  try {
    await FavoriteModel.create({
      userId: new Types.ObjectId(userId),
      noteId: new Types.ObjectId(noteId),
    });
  } catch (e: unknown) {
    const code =
      e && typeof e === "object" && "code" in e
        ? (e as { code?: number }).code
        : undefined;
    if (code === 11000) {
      return { alreadyFavorited: true as const };
    }
    throw e instanceof Error ? e : new Error("Failed to add favorite");
  }

  return { alreadyFavorited: false as const };
}

export async function removeFavorite(userId: string, noteId: string) {
  if (!Types.ObjectId.isValid(noteId)) {
    throw new Error("Invalid note id");
  }

  const result = await FavoriteModel.deleteOne({
    userId: new Types.ObjectId(userId),
    noteId: new Types.ObjectId(noteId),
  });

  if (result.deletedCount === 0) {
    throw new Error("Favorite not found");
  }
}

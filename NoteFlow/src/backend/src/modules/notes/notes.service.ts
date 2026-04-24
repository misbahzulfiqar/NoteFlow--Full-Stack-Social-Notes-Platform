import { randomBytes } from "node:crypto";
import { Types } from "mongoose";
import { NoteModel } from "../../models/Note.model";
import type { CreateNoteInput, UpdateNoteInput } from "./notes.validation";

export type NoteResponse = {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  coverImage: string | null;
  visibility: "public" | "private";
  likesCount: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

type ListParams = {
  page: number;
  limit: number;
  search?: string;
  tag?: string;
  sort: "recent" | "oldest";
  visibility?: "public" | "private";
};

type NoteLean = {
  _id: { toString(): string };
  title: string;
  content: string;
  slug: string;
  tags: string[];
  coverImage?: string | null;
  visibility: "public" | "private";
  likes?: { length: number } | unknown[];
  owner: { toString(): string };
  createdAt: Date;
  updatedAt: Date;
};

function buildSearchFilter(search?: string) {
  if (!search?.trim()) return {};
  const regex = new RegExp(search.trim(), "i");
  return {
    $or: [{ title: regex }, { content: regex }, { tags: regex }],
  };
}

export async function getPublicNotes(params: ListParams) {
  const skip = (params.page - 1) * params.limit;
  const sort = params.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const filter: Record<string, unknown> = {
    visibility: "public",
    ...buildSearchFilter(params.search),
  };

  if (params.tag) filter.tags = params.tag;

  const [docs, total] = await Promise.all([
    NoteModel.find(filter).sort(sort).skip(skip).limit(params.limit).lean(),
    NoteModel.countDocuments(filter),
  ]);

  return {
    notes: docs.map((d) => toResponse(d as NoteLean)),
    total,
    page: params.page,
    limit: params.limit,
  };
}

export async function getPublicNoteBySlug(slug: string): Promise<NoteResponse | null> {
  const doc = await NoteModel.findOne({ slug, visibility: "public" }).lean();
  return doc ? toResponse(doc as NoteLean) : null;
}

export async function getOwnNotes(ownerId: string, params: ListParams) {
  const skip = (params.page - 1) * params.limit;
  const sort = params.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const filter: Record<string, unknown> = {
    owner: new Types.ObjectId(ownerId),
    ...buildSearchFilter(params.search),
  };

  if (params.tag) filter.tags = params.tag;
  if (params.visibility) filter.visibility = params.visibility;

  const [docs, total] = await Promise.all([
    NoteModel.find(filter).sort(sort).skip(skip).limit(params.limit).lean(),
    NoteModel.countDocuments(filter),
  ]);

  return {
    notes: docs.map((d) => toResponse(d as any)),
    total,
    page: params.page,
    limit: params.limit,
  };
}

export async function getOwnNoteById(ownerId: string, noteId: string): Promise<NoteResponse | null> {
  if (!Types.ObjectId.isValid(noteId)) return null;
  const doc = await NoteModel.findOne({
    _id: noteId,
    owner: new Types.ObjectId(ownerId),
  }).lean();

  return doc ? toResponse(doc as NoteLean) : null;
}

function slugify(title: string): string {
  const base = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base.length > 0 ? base : "note";
}

function randomSuffix(length = 6): string {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

function toResponse(doc: {
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

export async function createNote(
  ownerId: string,
  input: CreateNoteInput
): Promise<NoteResponse> {
  const owner = new Types.ObjectId(ownerId);
  const baseSlug = slugify(input.title);
  const maxAttempts = 8;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const slug = `${baseSlug}-${randomSuffix(6)}`;

    try {
      const created = await NoteModel.create({
        title: input.title.trim(),
        content: input.content,
        tags: input.tags.map((t) => t.trim()),
        coverImage: null,
        visibility: input.visibility,
        likes: [],
        owner,
        slug,
      });

      return toResponse(created);
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code?: number }).code
          : undefined;

      if (code === 11000) continue;
      throw err instanceof Error ? err : new Error("Failed to create note");
    }
  }

  throw new Error("Could not allocate a unique slug");
}

export async function updateNoteCover(
  ownerId: string,
  noteId: string,
  coverImage: string
): Promise<NoteResponse> {
  if (!Types.ObjectId.isValid(noteId)) {
    throw new Error("Invalid note id");
  }

  const note = await NoteModel.findOneAndUpdate(
    { _id: noteId, owner: new Types.ObjectId(ownerId) },
    { coverImage },
    { new: true }
  );

  if (!note) {
    throw new Error("Note not found");
  }

  return toResponse(note as NoteLean);
}

export async function updateNote(
  ownerId: string,
  noteId: string,
  input: UpdateNoteInput,
): Promise<NoteResponse> {
  if (!Types.ObjectId.isValid(noteId)) {
    throw new Error("Invalid note id");
  }

  const existing = await NoteModel.findOne({
    _id: noteId,
    owner: new Types.ObjectId(ownerId),
  }).lean();

  if (!existing) {
    throw new Error("Note not found");
  }

  const ex = existing as NoteLean;
  const title = input.title !== undefined ? input.title.trim() : ex.title;
  const content = input.content !== undefined ? input.content : ex.content;
  const tags =
    input.tags !== undefined ? input.tags.map((t) => t.trim()) : ex.tags;
  const visibility =
    input.visibility !== undefined ? input.visibility : ex.visibility;

  const titleChanged = input.title !== undefined && title !== ex.title;

  if (titleChanged) {
    const baseSlug = slugify(title);
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const newSlug = `${baseSlug}-${randomSuffix(6)}`;
      try {
        const doc = await NoteModel.findOneAndUpdate(
          { _id: noteId, owner: new Types.ObjectId(ownerId) },
          { title, content, tags, visibility, slug: newSlug },
          { new: true },
        ).lean();
        if (!doc) throw new Error("Note not found");
        return toResponse(doc as NoteLean);
      } catch (err: unknown) {
        const code =
          err && typeof err === "object" && "code" in err
            ? (err as { code?: number }).code
            : undefined;
        if (code === 11000) continue;
        throw err instanceof Error ? err : new Error("Failed to update note");
      }
    }
    throw new Error("Could not allocate a unique slug");
  }

  const doc = await NoteModel.findOneAndUpdate(
    { _id: noteId, owner: new Types.ObjectId(ownerId) },
    { title, content, tags, visibility },
    { new: true },
  ).lean();

  if (!doc) throw new Error("Note not found");
  return toResponse(doc as NoteLean);
}

export async function deleteNote(ownerId: string, noteId: string): Promise<void> {
  if (!Types.ObjectId.isValid(noteId)) {
    throw new Error("Invalid note id");
  }

  const result = await NoteModel.deleteOne({
    _id: noteId,
    owner: new Types.ObjectId(ownerId),
  });

  if (result.deletedCount === 0) {
    throw new Error("Note not found");
  }
}
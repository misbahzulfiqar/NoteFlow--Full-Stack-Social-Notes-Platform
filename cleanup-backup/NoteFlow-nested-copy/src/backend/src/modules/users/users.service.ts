import { Types } from "mongoose";
import { UserModel } from "../../models/User.model";
import { listPublicNotesByOwner } from "../notes/notes.service";
import type { NoteResponse } from "../notes/notes.service";

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
};

function toPublicUser(doc: {
  _id: { toString(): string };
  email: string;
  name?: string;
  avatar?: string | null;
}): PublicUser {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name ?? "",
    avatar: doc.avatar ?? null,
  };
}

export async function updateUserProfile(
  userId: string,
  input: { name: string; avatarUrl?: string }
): Promise<PublicUser> {
  const update: { name: string; avatar?: string } = { name: input.name };
  if (input.avatarUrl !== undefined) {
    update.avatar = input.avatarUrl;
  }

  const doc = await UserModel.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true }
  ).lean();

  if (!doc) {
    throw new Error("User not found");
  }

  return toPublicUser(doc);
}

export async function getUserPublicProfile(userId: string): Promise<{
  user: PublicUser;
  notes: NoteResponse[];
} | null> {
  if (!Types.ObjectId.isValid(userId)) return null;
  const user = await UserModel.findById(userId).lean();
  if (!user) return null;
  const notes = await listPublicNotesByOwner(userId, 100);
  return { user: toPublicUser(user), notes };
}
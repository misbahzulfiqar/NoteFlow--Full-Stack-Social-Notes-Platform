import { UserModel } from "../../models/User.model";

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
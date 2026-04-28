import type { Request, Response } from "express";
import { uploadImageBuffer } from "../../services/cloudinary.service";
import { patchProfileSchema } from "./users.validation";
import { getUserPublicProfile, updateUserProfile } from "./users.service";

function getSingleParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function getUserPublicProfileController(req: Request, res: Response) {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid user id" });
    const data = await getUserPublicProfile(id);
    if (!data) return res.status(404).json({ message: "User not found" });
    return res.json(data);
  } catch (e) {
    return res.status(400).json({
      message: e instanceof Error ? e.message : "Failed to load profile",
    });
  }
}

export async function patchProfileController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const rawName =
    typeof req.body?.name === "string" ? req.body.name : "";
  const parsed = patchProfileSchema.safeParse({ name: rawName });
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    let avatarUrl: string | undefined;
    const file = req.file;
    if (file?.buffer) {
      avatarUrl = await uploadImageBuffer(file.buffer, "noteflow/avatars");
    }

    const user = await updateUserProfile(req.user.id, {
      name: parsed.data.name,
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    });

    return res.json({ message: "Profile updated", user });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update profile";
    return res.status(400).json({ message });
  }
}
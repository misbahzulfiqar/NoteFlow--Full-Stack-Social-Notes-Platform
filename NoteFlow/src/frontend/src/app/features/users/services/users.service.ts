import { apiClient } from "@/lib/apiClient";
import type { AuthUser } from "@/store/authStore";

export type UpdateProfileResponse = {
  message?: string;
  user: AuthUser;
};

export async function updateProfile(input: {
  name: string;
  avatarFile?: File | null;
}): Promise<UpdateProfileResponse> {
  const formData = new FormData();
  formData.append("name", input.name.trim());
  if (input.avatarFile) {
    formData.append("avatar", input.avatarFile);
  }

  const res = await apiClient.patch<UpdateProfileResponse>(
    "/users/profile",
    formData
  );
  return res.data;
}
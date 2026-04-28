import { getApiBaseUrl } from "@/lib/getApiBaseUrl";
import type { AuthUser } from "@/store/authStore";
import { parseAuthResponseBody } from "@/features/auth/services/parseAuthResponseBody";

const API = `${getApiBaseUrl()}/auth`;

export type RegisterResponse = {
  accessToken: string;
  user: AuthUser;
};

export async function registerApi(payload: {
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const body = await parseAuthResponseBody<RegisterResponse & { message?: string }>(res);
  if (!res.ok) throw body;
  return body as RegisterResponse;
}

import { getApiBaseUrl } from "@/lib/getApiBaseUrl";
import type { AuthUser } from "@/store/authStore";
import { parseAuthResponseBody } from "@/features/auth/services/parseAuthResponseBody";

const API = `${getApiBaseUrl()}/auth`;

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export async function loginApi(payload: { email: string; password: string }): Promise<LoginResponse> {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const body = await parseAuthResponseBody<LoginResponse>(res);
  if (!res.ok) throw body;
  return body as LoginResponse;
}
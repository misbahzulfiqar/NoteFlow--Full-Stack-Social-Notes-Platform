import { getApiBaseUrl } from "@/lib/getApiBaseUrl";
import type { AuthUser } from "@/store/authStore";

const API = `${getApiBaseUrl()}/auth`;

export type RegisterResponse = {
  accessToken: string;
  user: AuthUser;
};

async function parseResponseBody<T>(res: Response): Promise<T | { message: string }> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  const text = await res.text();
  return {
    message: text || "Unexpected non-JSON response from server.",
  };
}

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

  const body = await parseResponseBody<RegisterResponse & { message?: string }>(res);
  if (!res.ok) throw body;
  return body as RegisterResponse;
}

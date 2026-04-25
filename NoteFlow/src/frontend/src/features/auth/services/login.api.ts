import { getApiBaseUrl } from "@/lib/getApiBaseUrl";
import type { AuthUser } from "@/store/authStore";

const API = `${getApiBaseUrl()}/auth`;

type LoginResponse = {
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

export async function loginApi(payload: { email: string; password: string }): Promise<LoginResponse> {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const body = await parseResponseBody<LoginResponse>(res);
  if (!res.ok) throw body;
  return body as LoginResponse;
}
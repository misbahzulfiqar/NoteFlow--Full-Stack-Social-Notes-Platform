
import { getApiBaseUrl } from "@/lib/getApiBaseUrl";

const API = `${getApiBaseUrl()}/auth`;

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

export async function registerApi(payload: { email: string; password: string }) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const body = await parseResponseBody<Record<string, unknown>>(res);
  if (!res.ok) throw body;
  return body as Record<string, unknown>;
}
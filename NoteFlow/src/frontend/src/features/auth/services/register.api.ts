
import { getApiBaseUrl } from "@/lib/getApiBaseUrl";

const API = `${getApiBaseUrl()}/auth`;

async function parseResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json();
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

  const body = await parseResponseBody(res);
  if (!res.ok) throw body;
  return body;
}
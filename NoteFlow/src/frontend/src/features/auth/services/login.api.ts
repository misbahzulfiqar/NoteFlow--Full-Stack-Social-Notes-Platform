import { getApiBaseUrl } from "@/lib/getApiBaseUrl";

const API = `${getApiBaseUrl()}/auth`;

export async function loginApi(payload: { email: string; password: string }) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}
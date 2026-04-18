const API = "http://localhost:5000/api/auth";

export async function registerApi(payload: { email: string; password: string }) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}
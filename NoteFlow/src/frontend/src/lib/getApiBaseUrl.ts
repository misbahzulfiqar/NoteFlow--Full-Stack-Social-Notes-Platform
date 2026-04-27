/**
 * Express API base URL (includes `/api` path prefix), per project architecture.
 *
 * - **Local:** defaults to `http://localhost:5000/api` when unset.
 * - **Vercel / production:** set `NEXT_PUBLIC_API_URL` to your deployed API
 *   origin with `/api` (e.g. `https://noteflow-api.railway.app/api`). The
 *   Next app and Express API are different origins; the browser must call the
 *   API URL directly (with CORS + credentials).
 */
function trimTrailingSlash(s: string) {
  return s.replace(/\/$/, "");
}

export function getApiBaseUrl(): string {
  const explicit = trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL?.trim() ?? "");

  if (explicit) {
    return explicit;
  }

  if (process.env.VERCEL === "1") {
    console.warn(
      "[NoteFlow] Set NEXT_PUBLIC_API_URL to your Express API (e.g. https://api.example.com/api) so the deployed app can reach the backend."
    );
  }

  return "http://localhost:5000/api";
}

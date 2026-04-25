/**
 * On Vercel, `NEXT_PUBLIC_VERCEL_URL` is set. A wrong `NEXT_PUBLIC_API_URL` (e.g. localhost)
 * makes the browser call the wrong host → 404 HTML and JSON parse errors.
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return "/api";
  }
  const v = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (v) return v.replace(/\/$/, "");
  return "/api";
}

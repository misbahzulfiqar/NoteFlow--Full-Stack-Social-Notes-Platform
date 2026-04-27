
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


function trimTrailingSlash(s: string) {
  return s.replace(/\/$/, "");
}

export function getApiBaseUrl(): string {
  const explicit = trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL?.trim() ?? "");

  if (explicit) {
    return explicit;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  return "http://localhost:5000/api";
}

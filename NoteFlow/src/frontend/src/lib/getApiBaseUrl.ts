export function getApiBaseUrl(): string {
    const v = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (v) return v.replace(/\/$/, "");
    return "/api";
  }
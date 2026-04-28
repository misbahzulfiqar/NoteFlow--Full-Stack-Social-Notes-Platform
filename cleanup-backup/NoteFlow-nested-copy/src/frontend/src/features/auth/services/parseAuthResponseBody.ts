export async function parseAuthResponseBody<T>(
  res: Response,
): Promise<T | { message: string }> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  const text = await res.text();
  return {
    message: text || "Unexpected non-JSON response from server.",
  };
}

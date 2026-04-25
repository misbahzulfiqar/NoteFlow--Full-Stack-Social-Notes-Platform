export function parseListQueryFromUrl(sp: URLSearchParams) {
  const page = Number(sp.get("page") ?? 1);
  const limit = Number(sp.get("limit") ?? 12);
  const search = sp.get("search") ?? undefined;
  const tag = sp.get("tag") ?? undefined;
  const sort: "recent" | "oldest" = sp.get("sort") === "oldest" ? "oldest" : "recent";
  const vis = sp.get("visibility");
  const visibility: "public" | "private" | undefined =
    vis === "public" || vis === "private" ? vis : undefined;

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 12,
    search: search === "" ? undefined : search,
    tag: tag === "" ? undefined : tag,
    sort,
    visibility,
  };
}

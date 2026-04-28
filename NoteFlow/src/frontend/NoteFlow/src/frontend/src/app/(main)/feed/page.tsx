"use client";

import Link from "next/link";
import { usePublicNotes } from "@/app/features/notes/hooks/usePublicNotes";
import { NoteFavoriteHeart } from "@/app/features/favourites/components/NoteFavoriteHeart";
import { useAuthStore } from "@/store/authStore";
import { NoteListPagination } from "@/app/features/notes/components/NoteListPagination";
import { useEffect, useMemo, useState } from "react";
import { useToggleFeedLike } from "@/app/features/notes/hooks/useToggleFeedLike";

const PAGE_SIZE = 16;

export default function FeedPage() {
  const user = useAuthStore((s) => s.user);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<"recent" | "oldest" | "popular">("recent");
  const { mutate: toggleLike, isPending: likeBusy } = useToggleFeedLike();

  useEffect(() => {
    setPage(1);
  }, [search, tag, sort]);

  const { data, isLoading, isError } = usePublicNotes({
    page,
    limit: PAGE_SIZE,
    sort,
    search: search || undefined,
    tag: tag || undefined,
  });

  const notes = data?.notes ?? [];

  const tagOptions = useMemo(() => {
    const s = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [notes]);

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Feed</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/notes/new"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Create Note
          </Link>
          {!user ? (
            <Link
              href="/login"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              Log in
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
        <div className="flex items-center rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput.trim())}
            placeholder="Search feed..."
            className="w-full bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => setSearch(searchInput.trim())}
            className="text-sm font-semibold text-violet-600"
          >
            Search
          </button>
        </div>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-2xl bg-white px-4 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200"
        >
          <option value="">All tags</option>
          {tagOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as "recent" | "oldest" | "popular")
          }
          className="rounded-2xl bg-white px-4 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200"
        >
          <option value="recent">Most recent</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most liked</option>
        </select>
      </div>

      {isLoading ? (
        <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
          Loading notes...
        </p>
      ) : isError ? (
        <p className="rounded-xl bg-red-50 p-6 text-sm text-red-600 ring-1 ring-red-200">
          Failed to load notes
        </p>
      ) : notes.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
          No public notes found
        </p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <article
              key={note.id}
              className="flex gap-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-white/70"
            >
              <Link href={`/n/${note.slug}`} className="block shrink-0">
                {note.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={note.coverImage}
                    alt={note.title}
                    className="h-28 w-28 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-xl bg-gradient-to-br from-violet-200 via-indigo-200 to-sky-200" />
                )}
              </Link>

              <div className="mt-2 min-w-0 flex-1">
                <Link href={`/n/${note.slug}`}>
                  <h2 className="text-base font-semibold text-slate-900 hover:text-indigo-600">
                    {note.title}
                  </h2>
                </Link>
                <div className="mt-1 flex shrink-0 flex-wrap items-center gap-2">
                  {user?.id === note.ownerId ? (
                    <Link
                      href={`/notes/${note.id}/edit`}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                  ) : null}
                  <NoteFavoriteHeart noteId={note.id} />
                  {user ? (
                    <button
                      type="button"
                      disabled={likeBusy}
                      onClick={() => toggleLike(note.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-indigo-600 disabled:opacity-50"
                    >
                      ♥ {note.likesCount}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">♥ {note.likesCount}</span>
                  )}
                </div>

                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                  {note.content}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {!isLoading && !isError && notes.length > 0 ? (
        <NoteListPagination
          page={page}
          total={data?.total}
          limit={PAGE_SIZE}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}

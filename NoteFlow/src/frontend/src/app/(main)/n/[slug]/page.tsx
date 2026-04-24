"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useMemo, useState } from "react";
import { usePublicNotes } from "@/app/features/notes/hooks/usePublicNotes";
import type { Note } from "@/app/features/notes/types";
import { NoteFavoriteHeart } from "@/app/features/favourites/components/NoteFavoriteHeart";
import { NoteListPagination } from "@/app/features/notes/components/NoteListPagination";

function timeAgo(dateIso: string) {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function FallbackCover({ seed }: { seed: string }) {
  const gradients = [
    "from-purple-300 via-pink-200 to-blue-200",
    "from-cyan-300 via-blue-200 to-indigo-200",
    "from-fuchsia-300 via-purple-200 to-indigo-200",
  ];
  const idx = Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % gradients.length;
  return <div className={`h-32 w-full bg-gradient-to-br ${gradients[idx]}`} />;
}

function NoteCard({ note }: { note: Note }) {
  const user = useAuthStore((s) => s.user);
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-200/70">
      <Link href={`/n/${note.slug}`} className="block">
        {note.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={note.coverImage} alt={note.title} className="h-42 w-full object-cover" />
        ) : (
          <FallbackCover seed={note.slug} />
        )}
      </Link>

      <div className="p-3">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 text-base font-bold leading-6 text-slate-900">
          {note.title}
        </h3>
        <div className="flex shrink-0 items-center gap-1">
          {user?.id === note.ownerId ? (
            <Link
              href={`/notes/${note.id}/edit`}
              className="rounded-lg px-2 py-0.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Edit
            </Link>
          ) : null}
          <NoteFavoriteHeart noteId={note.id} />
        </div>
      </div>

        <p className="line-clamp-2 min-h-[40px] text-xs leading-5 text-slate-500">{note.content}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-indigo-500">
            <span>🌐</span>
            <span className="font-semibold">Public</span>
          </span>
          <span className="text-slate-400">{timeAgo(note.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}

export default function PublicNotesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<"recent" | "oldest">("recent");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 16;

  useEffect(() => {
    setPage(1);
  }, [search, tag, sort]);
  const { data, isLoading, isError } = usePublicNotes({
    search,
    tag,
    sort,
    page,
    limit: PAGE_SIZE,
  });

  const notes = data?.notes ?? [];

  const tags = useMemo(() => {
    const s = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [notes]);

  return (
    <main className="min-h-screen bg-[#f6f7fd] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">Public Notes</h1>
            <p className="mt-1 text-sm text-slate-500">Discover and explore notes shared by the community</p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
            <div className="flex items-center rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput.trim())}
                placeholder="Search public notes..."
                className="w-full bg-transparent text-sm outline-none"
              />
              <button onClick={() => setSearch(searchInput.trim())} className="text-sm font-semibold text-violet-600">
                Search
              </button>
            </div>

            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="rounded-2xl bg-white px-4 py-2 text-sm text-gray-500 shadow-sm ring-1 ring-slate-200"
            >
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "recent" | "oldest")}
              className="rounded-2xl bg-white px-4 py-2 text-sm text-gray-500 shadow-sm ring-1 ring-slate-200"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </header>

        {isLoading ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">Loading notes...</p>
        ) : isError ? (
          <p className="rounded-xl bg-red-50 p-6 text-sm text-red-600 ring-1 ring-red-200">Failed to load notes</p>
        ) : notes.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">No public notes found</p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
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
    </main>
  );
}
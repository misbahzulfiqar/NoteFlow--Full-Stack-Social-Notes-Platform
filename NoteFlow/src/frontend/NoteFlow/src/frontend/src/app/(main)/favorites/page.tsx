"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useFavorites } from "./hooks/useFavorites";
import type { Note } from "@/app/features/notes/types";
import { NoteFavoriteHeart } from "@/app/features/favourites/components/NoteFavoriteHeart";
import { NoteListPagination } from "@/app/features/notes/components/NoteListPagination";

const PAGE_SIZE = 16;

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
  const idx =
    Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
    gradients.length;
  return <div className={`h-32 w-full bg-gradient-to-br ${gradients[idx]}`} />;
}

function NoteCard({ note }: { note: Note }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-200/70">
      <Link href={`/n/${note.slug}`} className="block">
        {note.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={note.coverImage}
            alt={note.title}
            className="h-42 w-full object-cover"
          />
        ) : (
          <FallbackCover seed={note.slug} />
        )}
      </Link>

      <div className="p-3">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-bold leading-6 text-slate-900">
            {note.title}
          </h3>
          <NoteFavoriteHeart noteId={note.id} className="shrink-0" />
        </div>

        <p className="line-clamp-2 min-h-[40px] text-xs leading-5 text-slate-500">
          {note.content}
        </p>

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

export default function FavoritesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useFavorites({ page, limit: PAGE_SIZE });
  const notes = data?.notes ?? [];
  const total = data?.total ?? 0;

  return (
    <main className="min-h-screen bg-[#f6f7fd] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              Favorites
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Notes you saved from the public feed
            </p>
          </div>
        </header>

        {isLoading ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            Loading favorites...
          </p>
        ) : isError ? (
          <p className="rounded-xl bg-red-50 p-6 text-sm text-red-600 ring-1 ring-red-200">
            Failed to load favorites
          </p>
        ) : total === 0 ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            No favorites yet
          </p>
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
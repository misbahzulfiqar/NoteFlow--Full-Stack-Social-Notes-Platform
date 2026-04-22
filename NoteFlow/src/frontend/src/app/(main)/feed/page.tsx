"use client";

import Link from "next/link";
import { usePublicNotes } from "@/app/features/notes/hooks/usePublicNotes";

export default function FeedPage() {
  const { data, isLoading, isError } = usePublicNotes({
    page: 1,
    limit: 12,
    sort: "recent",
  });

  const notes = data?.notes ?? [];

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Feed</h1>
        <Link
          href="/notes/new"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Create Note
        </Link>
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
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate text-lg font-semibold text-slate-800">
                    {note.title}
                  </h3>
                  <button className="text-slate-400 hover:text-slate-600">•••</button>
                </div>

                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                  {note.content}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-sm font-medium text-slate-500">
                    ♥ {note.likesCount}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
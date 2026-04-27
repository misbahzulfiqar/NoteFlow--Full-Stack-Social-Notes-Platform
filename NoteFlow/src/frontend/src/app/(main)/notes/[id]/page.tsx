"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMyNotes } from "@/app/features/notes/hooks/useMyNotes";

export default function PrivateNoteDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { data, isLoading, isError } = useMyNotes(id || undefined);

  const note = data?.note;

  if (isLoading) {
    return (
      <div className="px-4 py-8 lg:px-8">
        <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
          Loading note...
        </p>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="px-4 py-8 lg:px-8">
        <p className="rounded-xl bg-red-50 p-6 text-sm text-red-600 ring-1 ring-red-200">
          Note not found.
        </p>
        <Link
          href="/notes/private"
          className="mt-4 inline-block text-sm font-semibold text-indigo-600"
        >
          ← My private notes
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/notes/private"
          className="text-sm font-semibold text-indigo-600 hover:underline"
        >
          ← My private notes
        </Link>
        <Link
          href={`/notes/${note.id}/edit`}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Edit
        </Link>
      </div>

      {note.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={note.coverImage}
          alt=""
          className="mb-6 max-h-80 w-full rounded-2xl object-cover"
        />
      ) : null}

      <h1 className="text-3xl font-bold text-slate-900">{note.title}</h1>

      <p className="mt-2 text-sm text-slate-500">🔒 Private · ♥ {note.likesCount}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap text-slate-700">
        {note.content}
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { usePublicNoteBySlug } from "@/app/features/notes/hooks/usePublicNoteBySlug";
import { NoteFavoriteHeart } from "@/app/features/favourites/components/NoteFavoriteHeart";
import { useToggleFeedLike } from "@/app/features/notes/hooks/useToggleFeedLike";

export default function PublicNoteDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError } = usePublicNoteBySlug(slug || undefined);
  const { mutate: toggleLike, isPending: likePending } = useToggleFeedLike();

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
          Note not found or could not be loaded.
        </p>
        <Link href="/feed" className="mt-4 inline-block text-sm font-semibold text-indigo-600">
          ← Back to feed
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/feed" className="text-sm font-semibold text-indigo-600 hover:underline">
          ← Feed
        </Link>
        <div className="flex items-center gap-2">
          {user?.id === note.ownerId ? (
            <Link
              href={`/notes/${note.id}/edit`}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Edit
            </Link>
          ) : null}
          <NoteFavoriteHeart noteId={note.id} />
          {user ? (
            <button
              type="button"
              disabled={likePending}
              onClick={() => toggleLike(note.id)}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
            >
              ♥ {note.likesCount}
              <span className="sr-only">Toggle like</span>
            </button>
          ) : (
            <span className="text-sm text-slate-500">♥ {note.likesCount}</span>
          )}
        </div>
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

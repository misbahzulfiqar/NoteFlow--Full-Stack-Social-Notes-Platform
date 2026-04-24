"use client";

import Link from "next/link";
import { useMyPublicNotes } from "@/app/features/notes/hooks/useMyPublicNotes";
import type { Note } from "@/app/features/notes/types";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { ProfileForm } from "@/users/components/ProfileForm";
import { NoteFavoriteHeart } from "@/app/features/favourites/components/NoteFavoriteHeart";

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
        <div className="flex shrink-0 items-center gap-1">
          <NoteFavoriteHeart noteId={note.id} className="shrink-0" />
          <Link
            href={`/notes/${note.id}/edit`}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Edit
          </Link>
        </div>
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

export default function ProfilePage() {
    const [profileOpen, setProfileOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError } = useMyPublicNotes({
    page: 1,
    limit: 16,
    sort: "recent",
  });
  const notes = data?.notes ?? [];

  const displayName =
    (user?.name && user.name.trim()) ||
    user?.email?.split("@")[0] ||
    "Username";
  const handle = user?.email
    ? `@${user.email.split("@")[0]}`
    : "@username";

  return (
    <div className="min-h-full bg-gradient-to-b from-sky-100 via-indigo-50/80 to-indigo-100/40 pb-8">
      <div className="px-4 pb-6 pt-4 lg:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white shadow-md">
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/noteflow-logo.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <p className="truncate text-sm font-medium text-slate-700">
                {handle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#8e78ff] shadow-sm ring-1 ring-slate-200/80 transition hover:bg-slate-50"
            >
              Edit Profile
            </button>
          </div>
          <ProfileForm open={profileOpen} onClose={() => setProfileOpen(false)} />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            {displayName}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Product designer crafting calm interfaces. Writing about UX, habits,
            and tools that help you focus.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-white/80 backdrop-blur-sm">
              <span className="font-bold text-slate-900">{notes.length}</span>
              <span className="text-slate-600"> Public notes</span>
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-white/80 backdrop-blur-sm">
              <span className="font-bold text-slate-900">650</span>
              <span className="text-slate-600"> Followers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto min-h-[60vh] max-w-4xl pb-8 pt-2">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="pb-3 text-lg font-bold text-slate-900">
              Public Notes
            </span>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-4 rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            Loading notes...
          </p>
        ) : isError ? (
          <p className="mt-4 rounded-xl bg-red-50 p-6 text-sm text-red-600 ring-1 ring-red-200">
            Failed to load notes
          </p>
        ) : notes.length === 0 ? (
          <p className="mt-4 rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            No public notes found
          </p>
        ) : (
        <section className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

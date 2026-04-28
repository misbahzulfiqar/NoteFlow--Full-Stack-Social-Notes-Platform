"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useFavorites } from "@/app/(main)/favorites/hooks/useFavorites";
import {
  useAddFavorite,
  useRemoveFavorite,
} from "@/app/(main)/favorites/hooks/useFavoriteMutations";

const FAVORITES_LOOKUP_LIMIT = 200;

type Props = {
  noteId: string;
  className?: string;
};

export function NoteFavoriteHeart({ noteId, className = "" }: Props) {
  const user = useAuthStore((s) => s.user);
  const { data: favData } = useFavorites({
    page: 1,
    limit: FAVORITES_LOOKUP_LIMIT,
  });

  const serverFavorite = useMemo(
    () => favData?.notes.some((n) => n.id === noteId) ?? false,
    [favData, noteId],
  );

  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const isFavorite = optimistic ?? serverFavorite;

  useEffect(() => {
    setOptimistic(null);
  }, [serverFavorite]);

  const { mutate: addFav, isPending: adding } = useAddFavorite();
  const { mutate: removeFav, isPending: removing } = useRemoveFavorite();
  const pending = adding || removing;

  if (!user) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        title="Sign in to save favorites"
      >
        <HeartIcon filled={false} muted />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pending) return;
        const next = !isFavorite;
        setOptimistic(next);
        if (next) addFav(noteId);
        else removeFav(noteId);
      }}
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-full p-0.5 transition hover:bg-slate-100 disabled:opacity-50 ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <HeartIcon filled={isFavorite} />
    </button>
  );
}

function HeartIcon({ filled, muted }: { filled: boolean; muted?: boolean }) {
  if (filled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-7 w-7 shrink-0"
        aria-hidden
      >
        <path
          fill="#ef4444"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      className={`h-7 w-7 shrink-0 ${muted ? "text-slate-300" : "text-slate-400"}`}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

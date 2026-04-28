"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserPublicProfile } from "@/app/features/users/services/users.service";

export default function UserPublicProfilePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", "public", id],
    queryFn: () => getUserPublicProfile(id),
    enabled: Boolean(id),
  });

  if (!id) {
    return <p className="p-6 text-sm text-slate-600">Invalid profile link.</p>;
  }

  if (isLoading) {
    return (
      <p className="m-6 rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
        Loading profile...
      </p>
    );
  }

  if (isError || !data) {
    return (
      <p className="m-6 rounded-xl bg-red-50 p-6 text-sm text-red-600 ring-1 ring-red-200">
        User not found.
      </p>
    );
  }

  const { user, notes } = data;
  const displayName =
    (user.name && user.name.trim()) || user.email.split("@")[0] || "User";

  return (
    <div className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Public notes</h2>
        {notes.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No public notes yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {notes.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/n/${n.slug}`}
                  className="block rounded-xl bg-white p-4 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-900">{n.title}</span>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{n.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

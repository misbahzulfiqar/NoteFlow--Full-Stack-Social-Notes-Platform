"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

function NavItem({
  href,
  label,
  pathname,
  isActive,
}: {
  href: string;
  label: string;
  pathname: string;
  /** When set, used instead of `pathname === href` (e.g. `/n/*` for public notes). */
  isActive?: (pathname: string, href: string) => boolean;
}) {
  const active = isActive ? isActive(pathname, href) : pathname === href;
  return (
    <Link
      href={href}
      className={[
        "block rounded-xl px-4 py-2.5 text-sm font-medium transition",
        active
          ? "bg-gradient-to-r from-[#8e78ff] to-[#c48edf] text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}


function SidebarAccountFooter() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

  const displayName =
  (user?.name && user.name.trim()) ||
  user?.email?.split("@")[0] ||
  "Username";
    const initialSource =
  (user?.name && user.name.trim()[0]) ||
  user?.email?.[0] ||
  "";
const initial = initialSource ? initialSource.toUpperCase() : "";

  const handleLogout = async () => {
    try {
      await axios.post(`${apiBase}/auth/logout`, {}, { withCredentials: true });
    } catch {
      /* backend may not have logout yet */
    }
    useAuthStore.getState().setSession(null);
    router.push("/login");
  };

  return (
    <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
      <div
        className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8e78ff] to-[#c48edf] text-sm font-bold text-white"
        aria-hidden
      >
{user?.avatar ? (
          <Image
            src={user.avatar}
            alt=""
            fill
            sizes="40px"
            className="object-cover"
            unoptimized
          />
        ) : initial ? (
          <span>{initial}</span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
        <p className="truncate text-xs text-slate-500">{user?.email ?? ""}</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        title="Log out"
        aria-label="Log out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 text-slate-800 lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex h-full min-h-0 max-w-[1400px] flex-col lg:grid lg:h-full lg:grid-cols-[260px_1fr]">
        <aside className="hidden bg-white p-6 shadow-lg lg:flex lg:h-full lg:max-h-screen lg:shrink-0 lg:flex-col lg:overflow-y-auto">
          <header className="mb-8 flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image
                src="/noteflow-logo.jpg"
                alt="NoteFlow logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-wide text-[#287feb]">
              NoteFlow
            </span>
          </header>

          <nav className="flex-1 space-y-2">
            <NavItem href="/feed" label="All Feeds" pathname={pathname} />
            <NavItem href="/notes/new" label="Create Note" pathname={pathname} />
            <NavItem href="/notes/private" label="My Private Notes" pathname={pathname} />
            <NavItem href="/n/public" label="My Public Notes" pathname={pathname} isActive={(p, href) => p === href || (p.startsWith("/n/") && p.length > 3)} />
            <NavItem href="/favorites" label="Favorites" pathname={pathname} />
            <NavItem href="/profile" label="Profile" pathname={pathname} />
          </nav>

          {/* ✅ SidebarAccountFooter is now rendered here */}
          <SidebarAccountFooter />
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto lg:h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
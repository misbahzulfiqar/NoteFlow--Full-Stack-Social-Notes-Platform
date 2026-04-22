"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function NavItem({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = pathname === href;

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

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 text-slate-800">
      <div className="mx-auto lg:grid lg:min-h-screen lg:max-w-[1400px] lg:grid-cols-[260px_1fr]">
        <aside className="hidden bg-white p-6 shadow-lg lg:flex lg:flex-col">
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

          <nav className="space-y-2">
            <NavItem href="/feed" label="All Feeds" pathname={pathname} />
            <NavItem href="/notes/new" label="Create Note" pathname={pathname} />
            <NavItem href="/notes/" label="My Private Notes" pathname={pathname} />
            <NavItem href="/notes/public" label="My Public Notes" pathname={pathname} />
            <NavItem href="/favorites" label="Favorites" pathname={pathname} />
            <NavItem href="/profile" label="Profile" pathname={pathname} />
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
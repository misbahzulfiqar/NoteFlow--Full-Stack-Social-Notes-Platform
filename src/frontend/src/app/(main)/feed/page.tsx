import Link from "next/link";
import Image from "next/image";

type NoteItem = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  thumbClass: string;
};

const notes: NoteItem[] = [
  {
    id: 1,
    title: "Work Project",
    description: "Plan milestones, client updates, and next sprint priorities.",
    tags: ["UI Design", "Productivity"],
    likes: 30,
    thumbClass: "from-pink-200 via-fuchsia-100 to-cyan-100",
  },
  {
    id: 2,
    title: "Project For Writing",
    description: "Draft chapters, revise flow, and collect final references.",
    tags: ["UI Design", "Boundless"],
    likes: 15,
    thumbClass: "from-blue-200 via-sky-100 to-indigo-100",
  },
  {
    id: 3,
    title: "Smart to Reading",
    description: "Track reading sessions, key points, and action items.",
    tags: ["Reading", "Learning"],
    likes: 21,
    thumbClass: "from-violet-200 via-rose-100 to-orange-100",
  },
];

const filters = ["All Notes", "Favorites", "Work Project"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 text-slate-800">
      <div className="mx-auto lg:grid lg:min-h-screen lg:max-w-[1400px] lg:grid-cols-[260px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden border-r border-white/60 bg-white/50 p-6 backdrop-blur lg:flex lg:flex-col">
                  {/* Header */}
        <header className="flex items-center mb-8">
        <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src="/noteflow-logo.jpg"
              alt="NoteFlow logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-wide text-[#287feb]">
            NoteFlow
          </span>
        </header>


          <nav className="space-y-2">
            <SidebarItem label="All Feeds" active />
            <SidebarItem label="All Notes" />
            <SidebarItem label="Favorites" />
            <SidebarItem label="Projects" />
            <SidebarItem label="Profile" />
            <SidebarItem label="Settings" />
          </nav>

          <div className="mt-auto rounded-2xl bg-white/70 p-4">
            <p className="text-sm font-semibold text-slate-700">Quick Tip</p>
            <p className="mt-1 text-xs text-slate-500">
              Use tags to organize notes and find them faster.
            </p>
          </div>
        </aside>

        {/* Main */}
        <main className="pb-24 lg:pb-8">
          {/* Desktop Top Center Search */}
          <div className="hidden items-center justify-center px-6 pt-6 lg:flex">
            <div className="w-full max-w-2xl">
              <SearchInput />
            </div>
          </div>

          {/* Mobile Header */}
          <div className="px-4 pt-5 lg:hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">Feeds</h1>
              <div className="flex items-center gap-3 text-slate-500">
                <IconSearch className="h-6 w-6" />
                <IconBell className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4">
              <SearchInput />
            </div>
          </div>

          {/* Desktop Title + actions */}
          <div className="hidden items-center justify-between px-8 pt-6 lg:flex">
            <h1 className="text-3xl font-bold text-slate-900">Feed</h1>
            <div className="flex items-center gap-3 text-slate-500">
              <button className="rounded-full bg-white/70 p-2 shadow-sm transition hover:bg-white">
                <IconBell className="h-5 w-5" />
              </button>
              <button className="rounded-full bg-white/70 p-2 shadow-sm transition hover:bg-white">
                <IconUser className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <section className="mt-4 px-4 lg:mt-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter, idx) => (
                <button
                  key={filter}
                  className={[
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                    idx === 0
                      ? "bg-violet-100 text-violet-700"
                      : "bg-white/70 text-slate-600 hover:bg-white",
                  ].join(" ")}
                >
                  {filter}
                </button>
              ))}
              <button className="rounded-full bg-white/70 px-3 py-2 text-slate-500 hover:bg-white">
                <IconMore className="h-5 w-5" />
              </button>
            </div>
          </section>

          {/* Recent */}
          <section className="mt-6 px-4 lg:px-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-2xl">
                Recent
              </h2>
              <div className="flex items-center gap-3 text-slate-400">
                <IconSort className="h-5 w-5" />
                <IconInfo className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-3">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="flex gap-3 rounded-2xl bg-white/85 p-3 shadow-sm ring-1 ring-white/70"
                >
                  <div
                    className={`h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br ${note.thumbClass}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-lg font-semibold text-slate-800">
                        {note.title}
                      </h3>
                      <button className="text-slate-400 hover:text-slate-600">
                        <IconMore className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {note.description}
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

                      <button className="flex items-center gap-1 text-slate-500 hover:text-indigo-600">
                        <IconHeart className="h-5 w-5" />
                        <span className="text-sm font-medium">{note.likes}</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/70 bg-white/90 px-6 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between text-slate-500">
          <button className="text-indigo-600">
            <IconHome className="h-7 w-7" />
          </button>
          <button>
            <IconFolder className="h-7 w-7" />
          </button>
          <button className="rounded-full border-2 border-indigo-300 bg-white p-1.5 text-indigo-600">
            <IconPlus className="h-6 w-6" />
          </button>
          <button>
            <IconEye className="h-7 w-7" />
          </button>
          <button>
            <IconUser className="h-7 w-7" />
          </button>
        </div>
      </nav>
    </div>
  );
}

function SidebarItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <Link
      href="#"
      className={[
        "block rounded-xl px-4 py-2.5 text-sm font-medium transition",
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function SearchInput() {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-white/70">
      <IconSearch className="h-5 w-5 text-slate-400" />
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

function IconSearch({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconBell({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function IconUser({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-3.5 4.2-5 8-5s6.5 1.5 8 5" />
    </svg>
  );
}

function IconMore({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function IconSort({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M7 6v12" />
      <path d="m4 9 3-3 3 3" />
      <path d="M17 18V6" />
      <path d="m14 15 3 3 3-3" />
    </svg>
  );
}

function IconInfo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}

function IconHeart({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 20s-7-4.4-9-8.8A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9 6.2C19 15.6 12 20 12 20z" />
    </svg>
  );
}

function IconHome({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function IconFolder({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function IconPlus({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconEye({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
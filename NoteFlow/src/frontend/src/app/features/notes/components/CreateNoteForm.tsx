"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateNote } from "@/app/features/notes/hooks/useCreateNote";
import { useMyNotes } from "@/app/features/notes/hooks/useMyNotes";
import { useUpdateNote } from "@/app/features/notes/hooks/useUpdateNote";
import { uploadNoteCover } from "@/app/features/notes/services/notes.service";
import { getErrorMessage } from "@/lib/getErrorMessage";

type Visibility = "public" | "private";

type Props = {
  noteId?: string;
};

export default function CreateNoteForm({ noteId }: Props) {
  const isEdit = Boolean(noteId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [formError, setFormError] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { mutateAsync: createNote, isPending: isCreating } = useCreateNote();
  const { mutateAsync: patchNote, isPending: isUpdating } = useUpdateNote();
  const { data: loaded, isLoading: loadingNote, isError: loadError } =
    useMyNotes(noteId);

  useEffect(() => {
    const n = loaded?.note;
    if (!n || !isEdit) return;
    setTitle(n.title);
    setContent(n.content);
    setTags(n.tags.join(", "));
    setVisibility(n.visibility);
  }, [loaded?.note, isEdit]);

  const titleCount = useMemo(() => title.length, [title]);
  const contentCount = useMemo(() => content.length, [content]);

  const busy = isCreating || isUpdating || isCoverUploading;

  const handleCancel = () => {
    if (isEdit) router.back();
    else router.push("/feed");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      setFormError("Title and content are required.");
      return;
    }

    const cleanTags = Array.from(
      new Set(
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    );

    try {
      if (isEdit && noteId) {
        const { note } = await patchNote({
          id: noteId,
          payload: {
            title: cleanTitle,
            content: cleanContent,
            tags: cleanTags,
            visibility,
          },
        });

        if (coverFile) {
          setIsCoverUploading(true);
          try {
            await uploadNoteCover(note.id, coverFile);
          } finally {
            setIsCoverUploading(false);
          }
        }

        if (note.visibility === "public") router.push(`/n/${note.slug}`);
        else router.push(`/notes/${note.id}`);
        router.refresh();
        return;
      }

      const response = await createNote({
        title: cleanTitle,
        content: cleanContent,
        tags: cleanTags,
        visibility,
      });
      const { note } = response;

      if (coverFile) {
        setIsCoverUploading(true);
        try {
          await uploadNoteCover(note.id, coverFile);
        } finally {
          setIsCoverUploading(false);
        }
      }

      if (note.visibility === "public") router.push(`/n/${note.slug}`);
      else router.push(`/notes/${note.id}`);
      router.refresh();
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  if (isEdit && loadingNote) {
    return (
      <div className="px-6 py-16 text-center text-sm text-[#8d92b6]">
        Loading note…
      </div>
    );
  }

  if (isEdit && loadError) {
    return (
      <div className="px-6 py-16 text-center text-sm text-red-600">
        Could not load this note.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#1f2347] lg:text-2xl">
              {isEdit ? "Edit Note" : "Create Note"}
            </h1>
            <p className="mt-1 text-sm text-[#8d92b6]">
              {isEdit
                ? "Update your note and press Update"
                : "Write something amazing today ✨"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="cursor-pointer rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-[#6e7399] shadow-sm transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || (isEdit && loadingNote)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#8e78ff] to-[#6f8dff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(111,141,255,0.35)] transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              <SendIcon />
              {isEdit
                ? isUpdating
                  ? "Updating…"
                  : "Update"
                : isCreating
                  ? "Publishing…"
                  : "Publish Note"}
            </button>
          </div>
        </div>

        {formError ? (
          <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </p>
        ) : null}

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-[0_6px_16px_rgba(73,85,156,0.06)]">
              <label className="mb-2 block text-sm font-semibold text-[#353b67]">
                Title *
              </label>
              <div className="relative">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 200))}
                  placeholder="Enter note title..."
                  className="h-12 w-full rounded-xl bg-white px-4 text-sm text-[#21264a] outline-none focus:outline-none"
                />
                <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-[#9aa0c5]">
                  {titleCount}/200
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-[0_6px_16px_rgba(73,85,156,0.06)]">
              <label className="mb-2 block text-sm font-semibold text-[#353b67]">
                Tags
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags (comma separated)"
                className="h-12 w-full rounded-xl border border-transparent bg-white px-4 text-sm text-[#21264a] outline-none placeholder:text-[#9aa0c6] focus:border-transparent focus:outline-none focus:ring-0 focus:ring-offset-0"
              />
              <p className="mt-2 text-xs text-[#9aa0c5]">
                Example: productivity, ideas, work, learning
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-[0_6px_16px_rgba(73,85,156,0.06)]">
              <label className="mb-2 block text-sm font-semibold text-[#353b67]">
                Cover Image (Optional)
              </label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                id="note-cover-input"
                onChange={(e) => {
                  setCoverFile(e.target.files?.[0] ?? null);
                }}
              />
              <label
                htmlFor="note-cover-input"
                className="flex w-full cursor-pointer flex-col items-center rounded-xl bg-[#fbfcff] px-4 py-6 text-center transition hover:bg-[#f4f7ff]"
              >
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef1ff] text-[#7f83d7]">
                  <UploadIcon />
                </div>
                <p className="text-sm font-medium text-[#5f668f]">
                  {coverFile ? coverFile.name : "Upload cover image"}
                </p>
                <p className="mt-1 text-xs text-[#9aa0c5]">
                  JPG, PNG, WebP, GIF up to 5MB
                </p>
              </label>
              {coverFile ? (
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-[#6f8dff] underline"
                  onClick={() => {
                    setCoverFile(null);
                    if (coverInputRef.current) coverInputRef.current.value = "";
                  }}
                >
                  Remove file
                </button>
              ) : null}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-[0_6px_16px_rgba(73,85,156,0.06)]">
              <label className="mb-3 block text-sm font-semibold text-[#353b67]">
                Visibility
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <VisibilityCard
                  selected={visibility === "public"}
                  title="Public"
                  subtitle="Anyone can discover and read this note"
                  icon={<GlobeIcon />}
                  onClick={() => setVisibility("public")}
                />
                <VisibilityCard
                  selected={visibility === "private"}
                  title="Private"
                  subtitle="Only you can view this note"
                  icon={<LockIcon />}
                  onClick={() => setVisibility("private")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-4xl rounded-2xl bg-white p-5 shadow-[0_6px_16px_rgba(73,85,156,0.06)]">
          <label className="mb-2 block text-sm font-semibold text-[#353b67]">
            Content *
          </label>

          <div className="mb-3 flex flex-wrap items-center gap-1.5 border-b border-gray-100 pb-3 text-[#7f86b0]">
            <ToolBtn>B</ToolBtn>
            <ToolBtn>I</ToolBtn>
            <ToolBtn>U</ToolBtn>
            <div className="mx-1 h-5 w-px bg-gray-200" />
            <ToolBtn>≡</ToolBtn>
            <ToolBtn>☰</ToolBtn>
            <div className="mx-1 h-5 w-px bg-gray-200" />
            <ToolBtn>🔗</ToolBtn>
            <ToolBtn>&quot;</ToolBtn>
          </div>

          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 200000))}
              placeholder="Write your note content here..."
              className="h-80 w-full resize-none rounded-xl border border-transparent bg-white px-4 py-3 text-sm text-[#21264a] outline-none placeholder:text-[#9aa0c6] focus:border-transparent focus:outline-none focus:ring-0 focus:ring-offset-0 lg:h-96"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 text-xs text-[#9aa0c5]">
              {contentCount.toLocaleString()}/200,000
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}

function ToolBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg bg-white px-2.5 text-xs font-semibold text-[#6e739d] shadow-sm transition hover:bg-gray-50 hover:text-[#8e78ff]"
    >
      {children}
    </button>
  );
}

function VisibilityCard({
  selected,
  title,
  subtitle,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl bg-white p-4 text-left transition-all ${
        selected
          ? "bg-gradient-to-br from-[#fafbff] to-white ring-2 ring-[#b8c1ff]"
          : "hover:bg-[#fafbff]"
      }`}
    >
      <div className="mb-2 flex items-center gap-2 text-[#7880b4]">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef1ff]">
          {icon}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#2c315f]">{title}</p>
      <p className="mt-1 text-xs text-[#8b90b6]">{subtitle}</p>

      <span
        className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full ${
          selected ? "bg-[#7f8cff]" : "bg-[#e6e9ff]"
        }`}
      >
        {selected && <CheckIcon />}
      </span>
    </button>
  );
}

function Svg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    />
  );
}

const UploadIcon = () => (
  <Svg className="h-5 w-5">
    <path d="M12 16V7" />
    <path d="m8.5 10.5 3.5-3.5 3.5 3.5" />
    <path d="M20 16.5a4.5 4.5 0 0 0-1-8.9 6 6 0 0 0-11.6 1.8A4 4 0 0 0 8 17h12" />
  </Svg>
);

const GlobeIcon = () => (
  <Svg className="h-4 w-4">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18" />
    <path d="M12 3a15 15 0 0 0 0 18" />
  </Svg>
);

const LockIcon = () => (
  <Svg className="h-4 w-4">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 1 1 8 0v3" />
  </Svg>
);

const SendIcon = () => (
  <Svg className="h-4 w-4">
    <path d="m22 2-7 20-4-9-9-4z" />
    <path d="M22 2 11 13" />
  </Svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-3 w-3 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <path d="m6 12 4 4 8-8" />
  </svg>
);
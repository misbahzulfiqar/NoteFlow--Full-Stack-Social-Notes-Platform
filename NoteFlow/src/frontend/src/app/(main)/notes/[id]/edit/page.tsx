"use client";

import { useParams } from "next/navigation";
import CreateNoteForm from "@/app/features/notes/components/CreateNoteForm";

export default function EditNotePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  if (!id) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 px-9">
        <p className="p-8 text-sm text-red-600">Invalid note.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 px-9">
      <div className="mx-auto rounded-2xl p-6 shadow-sm ring-1 ring-white/70">
        <CreateNoteForm noteId={id} />
      </div>
    </main>
  );
}
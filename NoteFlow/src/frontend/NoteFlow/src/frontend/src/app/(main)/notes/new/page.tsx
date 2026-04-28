import CreateNoteForm from "@/app/features/notes/components/CreateNoteForm";

export default function NewNotePage() {
  return (
    <main className="min-h-screen px-9 bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100">
      <div className="mx-auto rounded-2xl p-6 shadow-sm ring-1 ring-white/70">
        <CreateNoteForm />
      </div>
    </main>
  );
}
type PageProps = {
    params: Promise<{ id: string }>;
  };
  
  export default async function PrivateNoteDetailPage({ params }: PageProps) {
    const { id } = await params;
  
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/85 p-6 shadow-sm ring-1 ring-white/70">
          <h1 className="text-2xl font-bold text-slate-900">Private Note Detail</h1>
          <p className="mt-3 text-sm text-slate-600">
            Placeholder page. Note ID: <span className="font-medium text-slate-800">{id}</span>
          </p>
        </div>
      </main>
    );
  }
type PageProps = {
    params: Promise<{ slug: string }>;
  };
  
  export default async function PublicNoteDetailPage({ params }: PageProps) {
    const { slug } = await params;
  
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/85 p-6 shadow-sm ring-1 ring-white/70">
          <h1 className="text-2xl font-bold text-slate-900">Public Note Detail</h1>
          <p className="mt-3 text-sm text-slate-600">
            Placeholder page. Slug: <span className="font-medium text-slate-800">{slug}</span>
          </p>
        </div>
      </main>
    );
  }
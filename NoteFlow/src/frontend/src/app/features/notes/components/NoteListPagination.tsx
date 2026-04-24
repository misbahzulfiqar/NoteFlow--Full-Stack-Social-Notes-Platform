"use client";

type NoteListPaginationProps = {
  page: number;
  total: number | undefined;
  limit: number;
  onPageChange: (nextPage: number) => void;
};

export function NoteListPagination({
  page,
  total,
  limit,
  onPageChange,
}: NoteListPaginationProps) {
  const safeTotal =
    typeof total === "number" && Number.isFinite(total) ? Math.max(0, total) : 0;
  const safeLimit = limit > 0 ? limit : 16;
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeLimit));

  if (safeTotal === 0 || totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-end gap-2"
      aria-label="Pagination"
    >
      <span className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
      >
        Previous
      </button>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;
  return (
    <div className="mt-5 flex items-center justify-between">
      <span className="text-[11.5px] text-zinc-500">
        Página <span className="font-mono text-zinc-300">{page + 1}</span> de <span className="font-mono text-zinc-300">{totalPages}</span>
      </span>
      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onChange(page - 1)}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 text-[12px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={13} /> Anterior
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => onChange(page + 1)}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 text-[12px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Siguiente <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

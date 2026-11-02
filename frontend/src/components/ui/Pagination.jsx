import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;
  return (
    <div className="mt-4 flex items-center justify-between">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Página {page + 1} de {totalPages}
      </span>
      <div className="flex gap-2">
        <button type="button" disabled={!canPrev} onClick={() => onChange(page - 1)} className="btn-secondary disabled:opacity-30">
          <ChevronLeft size={14} /> Anterior
        </button>
        <button type="button" disabled={!canNext} onClick={() => onChange(page + 1)} className="btn-secondary disabled:opacity-30">
          Siguiente <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

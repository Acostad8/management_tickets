import { UserCog } from 'lucide-react';

export function TopTecnicosWidget({ data }) {
  const rows = (data || []).slice(0, 5);
  return (
    <div className="border border-zinc-900 bg-zinc-950 p-5">
      <div className="mb-4 flex items-center gap-2">
        <UserCog size={13} className="text-brand-400" />
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Top técnicos
        </h3>
      </div>
      {rows.length === 0 ? (
        <p className="text-[12.5px] text-zinc-500">Sin asignaciones todavía</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((e, i) => {
            const total = Number(e.totalAsignados || 0);
            const resueltos = Number(e.resueltos || 0);
            const pct = total > 0 ? (resueltos / total) * 100 : 0;
            return (
              <li key={e.codigoEmpleado || i} className="flex items-center gap-3">
                <span className="font-mono text-[10.5px] text-zinc-600">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12.5px] text-zinc-200">
                      {`${e.nombre || ''} ${e.apellido || ''}`.trim() || e.codigoEmpleado}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-zinc-400">
                      {resueltos}/{total}
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-zinc-900">
                    <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

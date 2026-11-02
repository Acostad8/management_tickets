export function TicketsPorDiaChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="mb-2 text-[13px] font-medium text-slate-700 dark:text-slate-200">Actividad de tickets</h3>
        <p className="text-[13px] text-slate-500">Sin datos aún</p>
      </div>
    );
  }

  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  const avg = (total / data.length).toFixed(1);

  return (
    <div className="card">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">
            Actividad de tickets
          </h3>
          <p className="mt-0.5 text-[12px] text-slate-500">últimos {data.length} días con actividad</p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-slate-500">Promedio</div>
          <div className="font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {avg}
          </div>
        </div>
      </div>

      <div className="flex h-32 items-end gap-1.5">
        {data.map((d) => {
          const h = Math.max(4, (d.count / max) * 100);
          return (
            <div key={d.fecha} className="group relative flex flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-sm bg-brand-500/30 transition group-hover:bg-brand-500"
                style={{ height: `${h}%` }}
                title={`${d.fecha} · ${d.count} ticket(s)`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between font-mono text-[10px] tabular-nums text-slate-500">
        <span>{data[0].fecha}</span>
        <span>{data[data.length - 1].fecha}</span>
      </div>
    </div>
  );
}

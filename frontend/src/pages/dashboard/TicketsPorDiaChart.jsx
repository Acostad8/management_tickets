export function TicketsPorDiaChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="border border-zinc-900 bg-zinc-950 p-5">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Actividad reciente
        </h3>
        <p className="text-[13px] text-zinc-500">Sin datos aún</p>
      </div>
    );
  }

  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  const avg = (total / data.length).toFixed(1);

  return (
    <div className="border border-zinc-900 bg-zinc-950 p-5">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Actividad reciente
          </h3>
          <p className="mt-1 text-[12px] text-zinc-500">
            {data.length} días con actividad
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Promedio</div>
          <div className="mt-0.5 font-mono text-lg font-medium tabular-nums text-zinc-100">
            {avg}
          </div>
        </div>
      </div>

      <div className="flex h-36 items-end gap-1.5">
        {data.map((d) => {
          const h = Math.max(4, (d.count / max) * 100);
          return (
            <div key={d.fecha} className="group relative flex h-full flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-sm bg-brand-500/60 transition group-hover:bg-brand-400"
                style={{ height: `${h}%` }}
                title={`${d.fecha} · ${d.count} ticket(s)`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between font-mono text-[10px] tabular-nums text-zinc-600">
        <span>{data[0].fecha}</span>
        <span>{data[data.length - 1].fecha}</span>
      </div>
    </div>
  );
}

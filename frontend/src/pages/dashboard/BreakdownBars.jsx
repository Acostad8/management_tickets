export function BreakdownBars({ title, rows, colors }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="border border-zinc-900 bg-zinc-950 p-5">
      <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {title}
      </h3>
      <ul className="space-y-4">
        {rows.length === 0 && <li className="text-[13px] text-zinc-500">Sin datos</li>}
        {rows.map((r) => {
          const pct = (r.count / max) * 100;
          const color = (colors && colors[r.key]) || 'bg-brand-500/70';
          return (
            <li key={r.key}>
              <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                <span className="font-mono text-zinc-300">{r.key}</span>
                <span className="font-mono tabular-nums text-zinc-500">{r.count}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-zinc-900">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

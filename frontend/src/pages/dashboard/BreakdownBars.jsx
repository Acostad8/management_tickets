export function BreakdownBars({ title, rows, colors }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="card">
      <h3 className="mb-4 text-[13px] font-medium text-slate-700 dark:text-slate-200">{title}</h3>
      <ul className="space-y-3">
        {rows.length === 0 && <li className="text-[13px] text-slate-500">Sin datos</li>}
        {rows.map((r) => {
          const pct = (r.count / max) * 100;
          const color = (colors && colors[r.key]) || 'bg-brand-500/70';
          return (
            <li key={r.key}>
              <div className="mb-1 flex items-center justify-between text-[12.5px]">
                <span className="text-slate-700 dark:text-slate-300">{r.key}</span>
                <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">{r.count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

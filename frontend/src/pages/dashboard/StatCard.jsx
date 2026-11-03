import clsx from 'clsx';

export function StatCard({ label, value, icon: Icon, hint, accent, delta }) {
  const deltaNum = typeof delta === 'number' ? delta : null;
  const trend = deltaNum == null ? null : deltaNum > 0 ? 'up' : deltaNum < 0 ? 'down' : 'flat';
  return (
    <div className="relative overflow-hidden border border-zinc-900 bg-zinc-950 p-5 transition hover:border-zinc-800">
      <div className="flex items-start justify-between gap-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </div>
        {Icon && (
          <Icon size={15} className={clsx('flex-shrink-0', accent || 'text-zinc-600')} />
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-4xl font-semibold tabular-nums tracking-tight text-zinc-50">
          {value}
        </div>
        {trend && (
          <span className={clsx(
            'rounded px-1.5 py-0.5 font-mono text-[10.5px] tabular-nums',
            trend === 'up'   && 'bg-emerald-500/10 text-emerald-300',
            trend === 'down' && 'bg-red-500/10 text-red-300',
            trend === 'flat' && 'bg-zinc-800 text-zinc-400',
          )}>
            {deltaNum > 0 ? '+' : ''}{deltaNum}
          </span>
        )}
      </div>
      {hint && <div className="mt-2 text-[11.5px] text-zinc-500">{hint}</div>}
    </div>
  );
}

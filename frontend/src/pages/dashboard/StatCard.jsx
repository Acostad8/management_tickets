import clsx from 'clsx';

export function StatCard({ label, value, icon: Icon, hint, accent }) {
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
      <div className="mt-4 text-4xl font-semibold tabular-nums tracking-tight text-zinc-50">
        {value}
      </div>
      {hint && <div className="mt-2 text-[11.5px] text-zinc-500">{hint}</div>}
    </div>
  );
}

import clsx from 'clsx';

export const PERIODS = [
  { id: '7d',  label: '7 días',  days: 7 },
  { id: '30d', label: '30 días', days: 30 },
  { id: '90d', label: '90 días', days: 90 },
  { id: 'all', label: 'Histórico', days: null },
];

export function periodRange(id) {
  const p = PERIODS.find((x) => x.id === id);
  if (!p || p.days == null) return { desde: null, hasta: null };
  const hasta = new Date();
  const desde = new Date();
  desde.setDate(hasta.getDate() - p.days);
  return { desde: desde.toISOString(), hasta: hasta.toISOString() };
}

export function PeriodSelector({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-px rounded-md border border-zinc-800 bg-zinc-950 p-0.5">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={clsx(
            'rounded px-2.5 py-1 text-[11.5px] font-medium transition',
            value === p.id
              ? 'bg-zinc-800 text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-300',
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

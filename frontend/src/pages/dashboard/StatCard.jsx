import clsx from 'clsx';

export function StatCard({ label, value, icon: Icon, hint, accent, children }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {Icon && (
          <span className={clsx('inline-flex h-7 w-7 items-center justify-center rounded-md', accent || 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400')}>
            <Icon size={14} />
          </span>
        )}
      </div>
      <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {value}
      </div>
      {hint && <div className="text-[12px] text-slate-500 dark:text-slate-400">{hint}</div>}
      {children}
    </div>
  );
}

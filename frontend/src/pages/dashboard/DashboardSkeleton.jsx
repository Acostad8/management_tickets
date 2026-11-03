export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      <div className="flex flex-col gap-5 border-b border-zinc-900 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-7 w-72 rounded bg-zinc-900" />
          <div className="h-4 w-48 rounded bg-zinc-900/70" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-28 rounded bg-zinc-900" />
          <div className="h-8 w-24 rounded bg-zinc-900/70" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-zinc-900 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-zinc-900 bg-zinc-950 p-5">
            <div className="h-3 w-20 rounded bg-zinc-900" />
            <div className="mt-5 h-9 w-16 rounded bg-zinc-900" />
            <div className="mt-3 h-3 w-32 rounded bg-zinc-900/70" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-56 rounded border border-zinc-900 bg-zinc-950 lg:col-span-2" />
        <div className="h-56 rounded border border-zinc-900 bg-zinc-950" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-56 rounded border border-zinc-900 bg-zinc-950" />
        <div className="h-56 rounded border border-zinc-900 bg-zinc-950" />
      </div>
    </div>
  );
}

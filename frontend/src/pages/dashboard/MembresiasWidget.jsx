import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export function MembresiasWidget({ activas, porVencer }) {
  const warn = Number(porVencer || 0) > 0;
  return (
    <div className="border border-zinc-900 bg-zinc-950 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-emerald-400" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Membresías
          </h3>
        </div>
        <Link to="/membresias" className="inline-flex items-center gap-1 text-[11.5px] text-zinc-400 hover:text-zinc-100">
          Ver <ArrowRight size={11} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-zinc-900 bg-zinc-950/60 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Activas</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-emerald-300">{activas ?? 0}</div>
        </div>
        <div className="rounded-md border border-zinc-900 bg-zinc-950/60 p-3">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {warn && <AlertTriangle size={10} className="text-amber-400" />} Por vencer
          </div>
          <div className={`mt-1 text-2xl font-semibold tabular-nums ${warn ? 'text-amber-300' : 'text-zinc-100'}`}>
            {porVencer ?? 0}
          </div>
          <div className="mt-0.5 text-[10.5px] text-zinc-600">próximos 30 días</div>
        </div>
      </div>
    </div>
  );
}

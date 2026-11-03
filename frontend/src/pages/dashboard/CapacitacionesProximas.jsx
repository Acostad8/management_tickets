import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Calendar } from 'lucide-react';

export function CapacitacionesProximas({ items }) {
  const rows = (items || []).slice(0, 4);
  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap size={13} className="text-indigo-400" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Capacitaciones próximas
          </h3>
        </div>
        <Link to="/capacitaciones" className="inline-flex items-center gap-1 text-[11.5px] text-zinc-400 hover:text-zinc-100">
          Ver todas <ArrowRight size={11} />
        </Link>
      </div>
      <ul className="divide-y divide-zinc-900">
        {rows.length === 0 && (
          <li className="px-5 py-6 text-center text-[13px] text-zinc-500">Sin capacitaciones programadas</li>
        )}
        {rows.map((c) => (
          <li key={c.id} className="px-5 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] text-zinc-100">{c.titulo}</div>
                <div className="mt-1 flex items-center gap-2 text-[11.5px] text-zinc-500">
                  <Calendar size={11} />
                  <span className="tabular-nums">{formatFecha(c.fechaProgramada)}</span>
                  <span className="font-mono">· {c.modalidad}</span>
                </div>
              </div>
              <span className="shrink-0 rounded border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 font-mono text-[10px] text-indigo-300">
                {c.modulo}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-CO', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

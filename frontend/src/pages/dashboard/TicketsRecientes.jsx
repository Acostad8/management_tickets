import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ESTADO_COLORS, PRIORIDAD_COLORS } from '../../services/tickets';

export function TicketsRecientes({ tickets }) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Tickets recientes</h3>
        <Link to="/tickets" className="inline-flex items-center gap-1 text-[12px] text-brand-600 hover:underline dark:text-brand-400">
          Ver todos <ArrowRight size={12} />
        </Link>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {tickets.length === 0 && (
          <li className="py-3 text-[13px] text-slate-500">Sin tickets aún</li>
        )}
        {tickets.map((t) => (
          <li key={t.id}>
            <Link to={`/tickets/${t.id}`} className="flex items-center justify-between gap-3 py-2.5 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-500">{t.codigo}</span>
                  <Badge className={ESTADO_COLORS[t.estado]}>{t.estado}</Badge>
                </div>
                <div className="mt-0.5 truncate text-[13.5px] text-slate-800 dark:text-slate-100">{t.titulo}</div>
              </div>
              <Badge className={PRIORIDAD_COLORS[t.prioridad]}>{t.prioridad}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

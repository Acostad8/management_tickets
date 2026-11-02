import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ESTADO_COLORS, PRIORIDAD_COLORS } from '../../services/tickets';

export function TicketsRecientes({ tickets }) {
  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Tickets recientes
        </h3>
        <Link to="/tickets" className="inline-flex items-center gap-1 text-[12px] text-zinc-400 transition hover:text-zinc-100">
          Ver todos <ArrowRight size={12} />
        </Link>
      </div>
      <ul className="divide-y divide-zinc-900">
        {tickets.length === 0 && (
          <li className="px-5 py-6 text-center text-[13px] text-zinc-500">Sin tickets aún</li>
        )}
        {tickets.map((t) => (
          <li key={t.id}>
            <Link
              to={`/tickets/${t.id}`}
              className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-zinc-900/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-zinc-600">{t.codigo}</span>
                  <Badge className={ESTADO_COLORS[t.estado]}>{t.estado}</Badge>
                </div>
                <div className="mt-1 truncate text-[13.5px] text-zinc-200">{t.titulo}</div>
              </div>
              <Badge className={PRIORIDAD_COLORS[t.prioridad]}>{t.prioridad}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

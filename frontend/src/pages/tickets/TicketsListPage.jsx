import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, X, ArrowRight } from 'lucide-react';
import { ticketsService, ESTADOS, PRIORIDADES, MODULOS, ESTADO_COLORS, PRIORIDAD_COLORS } from '../../services/tickets';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useAuthStore } from '../../stores/useAuthStore';

export function TicketsListPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ estado: '', modulo: '', prioridad: '', codigo: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = { page, size: 10, sort: 'fechaCreacion,desc' };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    ticketsService.list(params)
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, filters]);

  const changeFilter = (name, value) => { setPage(0); setFilters((f) => ({ ...f, [name]: value })); };
  const activeFilters = Object.entries(filters).filter(([, v]) => v);
  const clearFilters = () => { setPage(0); setFilters({ estado: '', modulo: '', prioridad: '', codigo: '' }); };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-zinc-50">
            Tickets de soporte
          </h1>
          <p className="mt-1.5 text-[13.5px] text-zinc-400">
            Todos los casos reportados por los clientes, en orden cronológico.
          </p>
        </div>
        {hasPermission('tickets.crear') && (
          <Link to="/tickets/nuevo" className="btn-primary self-start sm:self-end">
            <Plus size={14} /> Nuevo ticket
          </Link>
        )}
      </header>

      <section className="border border-zinc-900 bg-zinc-950">
        <div className="grid grid-cols-1 gap-px bg-zinc-900 sm:grid-cols-2 lg:grid-cols-4">
          <FilterInput
            label="Código"
            icon={Search}
            value={filters.codigo}
            placeholder="TK-2026-…"
            onChange={(v) => changeFilter('codigo', v)}
          />
          <FilterSelect
            label="Estado"
            value={filters.estado}
            options={ESTADOS}
            onChange={(v) => changeFilter('estado', v)}
          />
          <FilterSelect
            label="Módulo"
            value={filters.modulo}
            options={MODULOS}
            onChange={(v) => changeFilter('modulo', v)}
          />
          <FilterSelect
            label="Prioridad"
            value={filters.prioridad}
            options={PRIORIDADES}
            onChange={(v) => changeFilter('prioridad', v)}
          />
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-zinc-900 px-4 py-3">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500">Activos:</span>
            {activeFilters.map(([k, v]) => (
              <button
                key={k}
                onClick={() => changeFilter(k, '')}
                className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 font-mono text-[11.5px] text-zinc-200 transition hover:border-zinc-700"
              >
                {k}: {v} <X size={11} className="text-zinc-500" />
              </button>
            ))}
            <button onClick={clearFilters} className="ml-1 text-[11.5px] text-zinc-500 transition hover:text-zinc-200">
              Limpiar
            </button>
          </div>
        )}
      </section>

      <div className="flex items-center justify-between">
        <span className="text-[11.5px] text-zinc-500">
          {loading ? 'Cargando…' : data ? `${data.totalElements} resultado(s)` : ''}
        </span>
      </div>

      {data && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
            <table className="min-w-full divide-y divide-zinc-900 text-[13px]">
              <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3 text-left">Código</th>
                  <th className="px-4 py-3 text-left">Título</th>
                  <th className="px-4 py-3 text-left">Módulo</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Prioridad</th>
                  <th className="px-4 py-3 text-left">Creado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {data.content.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                      No hay tickets que coincidan con los filtros.
                    </td>
                  </tr>
                )}
                {data.content.map((t) => (
                  <tr
                    key={t.id}
                    className="group cursor-pointer transition hover:bg-zinc-900/40"
                    onClick={() => navigate(`/tickets/${t.id}`)}
                  >
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <span className="font-mono text-[11.5px] text-zinc-500 group-hover:text-zinc-300">
                        {t.codigo}
                      </span>
                    </td>
                    <td className="max-w-sm px-4 py-3 align-middle">
                      <span className="truncate text-zinc-100">{t.titulo}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <span className="font-mono text-[12px] text-zinc-400">{t.modulo}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <Badge className={ESTADO_COLORS[t.estado]}>{t.estado}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <Badge className={PRIORIDAD_COLORS[t.prioridad]}>{t.prioridad}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <span className="font-mono text-[11.5px] tabular-nums text-zinc-500">
                        {formatDate(t.fechaCreacion)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                      <span className="inline-flex items-center gap-1 text-[12px] text-zinc-500 transition group-hover:text-zinc-100">
                        Abrir <ArrowRight size={12} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

function FilterInput({ label, value, onChange, placeholder, icon: Icon }) {
  return (
    <div className="bg-zinc-950 p-3">
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-8 w-full rounded-md border border-zinc-800 bg-zinc-900/50 text-[12.5px] text-zinc-100 placeholder:text-zinc-600 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50 ${Icon ? 'pl-8 pr-2' : 'px-2.5'}`}
        />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="bg-zinc-950 p-3">
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2 text-[12.5px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
      >
        <option value="">Todos</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} d`;
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

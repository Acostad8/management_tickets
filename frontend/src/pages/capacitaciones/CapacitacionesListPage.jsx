import { useEffect, useMemo, useState } from 'react';
import { Search, X, Plus, Pencil, Eye, GraduationCap, Calendar, Users, CheckCircle2, Shuffle } from 'lucide-react';
import { capacitacionesService } from '../../services/capacitaciones';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useAuthStore } from '../../stores/useAuthStore';
import { CapacitacionFormModal } from './CapacitacionFormModal';
import { CapacitacionDetailModal } from './CapacitacionDetailModal';
import { ChangeEstadoCapacitacionModal } from './ChangeEstadoCapacitacionModal';

const MODULOS = ['ventas_online', 'inventarios', 'compras', 'produccion', 'ventas_sitio'];
const MODALIDADES = ['masiva', 'personalizada'];
const ESTADOS = ['programada', 'en_curso', 'finalizada', 'cancelada'];

const ESTADO_COLORS = {
  programada: 'bg-brand-500/10 text-brand-300 border border-brand-500/20',
  en_curso:   'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  finalizada: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  cancelada:  'bg-red-500/10 text-red-300 border border-red-500/20',
};

const formatDateTime = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return iso; }
};

export function CapacitacionesListPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ titulo: '', modulo: '', modalidad: '', estado: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [changingEstado, setChangingEstado] = useState(null);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const load = () => {
    setLoading(true);
    const params = { page, size: 10, sort: 'fechaProgramada,desc' };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    capacitacionesService.list(params)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, filters]);

  const changeFilter = (name, value) => { setPage(0); setFilters((f) => ({ ...f, [name]: value })); };
  const activeFilters = Object.entries(filters).filter(([, v]) => v);
  const clearFilters = () => { setPage(0); setFilters({ titulo: '', modulo: '', modalidad: '', estado: '' }); };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setModalOpen(true); };
  const openDetail = (c) => { setViewing(c); setDetailOpen(true); };

  const openChangeEstado = (c) => setChangingEstado(c);

  const stats = useMemo(() => {
    const rows = data?.content || [];
    return {
      total: data?.totalElements ?? 0,
      programadas: rows.filter((c) => c.estado === 'programada').length,
      finalizadas: rows.filter((c) => c.estado === 'finalizada').length,
      asistencias: rows.reduce((acc, c) => acc + (c.asistenciasRegistradas || 0), 0),
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-zinc-50">
            Capacitaciones
          </h1>
          <p className="mt-1.5 text-[13.5px] text-zinc-400">
            Sesiones de formación masivas o personalizadas sobre los módulos ERP/POS.
          </p>
        </div>
        {hasPermission('capacitaciones.crear') && (
          <button onClick={openCreate} className="btn-primary self-start sm:self-end">
            <Plus size={14} /> Nueva capacitación
          </button>
        )}
      </header>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-900 bg-zinc-900 lg:grid-cols-4">
        <StatMini icon={GraduationCap} label="Total" value={stats.total} />
        <StatMini icon={Calendar} label="Programadas (página)" value={stats.programadas} accent="text-brand-400" />
        <StatMini icon={CheckCircle2} label="Finalizadas (página)" value={stats.finalizadas} accent="text-emerald-400" />
        <StatMini icon={Users} label="Asistentes (página)" value={stats.asistencias} accent="text-amber-400" />
      </section>

      <section className="border border-zinc-900 bg-zinc-950">
        <div className="grid grid-cols-1 gap-px bg-zinc-900 sm:grid-cols-4">
          <FilterInput label="Título" icon={Search} value={filters.titulo} placeholder="buscar..." onChange={(v) => changeFilter('titulo', v)} />
          <FilterSelect label="Módulo" value={filters.modulo} options={MODULOS} onChange={(v) => changeFilter('modulo', v)} />
          <FilterSelect label="Modalidad" value={filters.modalidad} options={MODALIDADES} onChange={(v) => changeFilter('modalidad', v)} />
          <FilterSelect label="Estado" value={filters.estado} options={ESTADOS} onChange={(v) => changeFilter('estado', v)} />
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

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[12.5px] text-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[11.5px] text-zinc-500">
          {loading ? 'Cargando…' : data ? `${data.totalElements} capacitación(es)` : ''}
        </span>
      </div>

      {data && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
            <table className="min-w-full divide-y divide-zinc-900 text-[13px]">
              <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3 text-left">Título · Módulo</th>
                  <th className="px-4 py-3 text-left">Modalidad</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Instructor</th>
                  <th className="px-4 py-3 text-left">Asistentes</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {data.content.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                      No hay capacitaciones que coincidan con los filtros.
                    </td>
                  </tr>
                )}
                {data.content.map((c) => (
                  <tr key={c.id} className="group transition hover:bg-zinc-900/40">
                    <td className="px-4 py-3 align-middle">
                      <div className="text-zinc-100">{c.titulo}</div>
                      {c.modulo && (
                        <div className="mt-0.5 font-mono text-[11px] text-brand-300">{c.modulo}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[11px]">
                        {c.modalidad}
                      </Badge>
                      {c.clientesInvitados?.length > 0 && (
                        <div className="mt-0.5 text-[11px] text-zinc-500">
                          {c.clientesInvitados.length} invitado(s)
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle font-mono text-[11.5px] text-zinc-300">
                      {formatDateTime(c.fechaProgramada)}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      {c.instructorNombre ? (
                        <span className="text-zinc-300">{c.instructorNombre}</span>
                      ) : <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <span className="font-mono text-[12px] tabular-nums text-zinc-200">
                        {c.asistenciasRegistradas || 0}{c.cupoMaximo ? ` / ${c.cupoMaximo}` : ''}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <Badge className={ESTADO_COLORS[c.estado]}>{c.estado}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDetail(c)}
                          className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
                        >
                          <Eye size={11} /> Ver
                        </button>
                        {hasPermission('capacitaciones.actualizar') && c.estado !== 'finalizada' && (
                          <>
                            <button
                              onClick={() => openEdit(c)}
                              className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
                            >
                              <Pencil size={11} /> Editar
                            </button>
                            <button
                              onClick={() => openChangeEstado(c)}
                              disabled={busyId === c.id}
                              className="inline-flex items-center gap-1 rounded-md border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[11.5px] text-brand-200 transition hover:border-brand-500/50 hover:bg-brand-500/15 disabled:opacity-40"
                            >
                              <Shuffle size={11} /> Cambiar estado
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      <CapacitacionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        capacitacion={editing}
      />

      <CapacitacionDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onChanged={load}
        capacitacion={viewing}
      />

      <ChangeEstadoCapacitacionModal
        open={Boolean(changingEstado)}
        onClose={() => setChangingEstado(null)}
        onSaved={load}
        capacitacion={changingEstado}
      />

    </div>
  );
}

function StatMini({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-zinc-950 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</span>
        {Icon && <Icon size={13} className={accent || 'text-zinc-600'} />}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-zinc-50">{value}</div>
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

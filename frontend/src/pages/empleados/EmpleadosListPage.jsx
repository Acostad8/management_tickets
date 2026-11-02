import { useEffect, useMemo, useState } from 'react';
import { Search, X, Plus, Pencil, Trash2, Power, Users, CheckCircle2, XCircle, Wrench } from 'lucide-react';
import { empleadosService } from '../../services/empleados';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAuthStore } from '../../stores/useAuthStore';
import { EmpleadoFormModal } from './EmpleadoFormModal';

const AREAS = ['soporte', 'desarrollo', 'operaciones'];
const MODULOS = ['ventas_online', 'inventarios', 'compras', 'produccion', 'ventas_sitio'];
const ESTADOS = ['activo', 'inactivo'];

const ESTADO_COLORS = {
  activo:   'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  inactivo: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
};

const NIVEL_COLORS = {
  junior: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  senior: 'bg-brand-500/10 text-brand-300 border border-brand-500/20',
  lead:   'bg-amber-500/10 text-amber-300 border border-amber-500/20',
};

export function EmpleadosListPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ codigo: '', nombre: '', area: '', especialidad: '', estado: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const load = () => {
    setLoading(true);
    const params = { page, size: 10, sort: 'codigoEmpleado,asc' };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    empleadosService.list(params)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, filters]);

  const changeFilter = (name, value) => { setPage(0); setFilters((f) => ({ ...f, [name]: value })); };
  const activeFilters = Object.entries(filters).filter(([, v]) => v);
  const clearFilters = () => { setPage(0); setFilters({ codigo: '', nombre: '', area: '', especialidad: '', estado: '' }); };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (e) => { setEditing(e); setModalOpen(true); };

  const requestToggle = (e) => setConfirmToggle(e);
  const requestDelete = (e) => setConfirmDelete(e);

  const doToggleEstado = async () => {
    const e = confirmToggle;
    if (!e) return;
    setError(''); setBusyId(e.id);
    const next = e.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await empleadosService.cambiarEstado(e.id, next);
      load();
      setConfirmToggle(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cambiar el estado.');
    } finally {
      setBusyId(null);
    }
  };

  const doDelete = async () => {
    const e = confirmDelete;
    if (!e) return;
    setError(''); setBusyId(e.id);
    try {
      await empleadosService.remove(e.id);
      load();
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo eliminar. Verifica tickets asignados.');
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const rows = data?.content || [];
    return {
      total: data?.totalElements ?? 0,
      activos: rows.filter((e) => e.estado === 'activo').length,
      inactivos: rows.filter((e) => e.estado === 'inactivo').length,
      soporte: rows.filter((e) => e.area === 'soporte').length,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-zinc-50">
            Empleados
          </h1>
          <p className="mt-1.5 text-[13.5px] text-zinc-400">
            Personal técnico que atiende tickets. Cada empleado está vinculado a un usuario con rol SOPORTE.
          </p>
        </div>
        {hasPermission('empleados.crear') && (
          <button onClick={openCreate} className="btn-primary self-start sm:self-end">
            <Plus size={14} /> Nuevo empleado
          </button>
        )}
      </header>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-900 bg-zinc-900 lg:grid-cols-4">
        <StatMini icon={Users} label="Total" value={stats.total} />
        <StatMini icon={CheckCircle2} label="Activos (página)" value={stats.activos} accent="text-emerald-400" />
        <StatMini icon={XCircle} label="Inactivos (página)" value={stats.inactivos} accent="text-zinc-400" />
        <StatMini icon={Wrench} label="Área soporte (página)" value={stats.soporte} accent="text-brand-400" />
      </section>

      <section className="border border-zinc-900 bg-zinc-950">
        <div className="grid grid-cols-1 gap-px bg-zinc-900 sm:grid-cols-5">
          <FilterInput label="Código" icon={Search} value={filters.codigo} placeholder="EMP-..." onChange={(v) => changeFilter('codigo', v)} />
          <FilterInput label="Nombre" icon={Search} value={filters.nombre} placeholder="buscar..." onChange={(v) => changeFilter('nombre', v)} />
          <FilterSelect label="Área" value={filters.area} options={AREAS} onChange={(v) => changeFilter('area', v)} />
          <FilterSelect label="Especialidad" value={filters.especialidad} options={MODULOS} onChange={(v) => changeFilter('especialidad', v)} />
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
          {loading ? 'Cargando…' : data ? `${data.totalElements} empleado(s)` : ''}
        </span>
      </div>

      {data && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
            <table className="min-w-full divide-y divide-zinc-900 text-[13px]">
              <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3 text-left">Código</th>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Área · Cargo</th>
                  <th className="px-4 py-3 text-left">Especialidad</th>
                  <th className="px-4 py-3 text-left">Nivel</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {data.content.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                      No hay empleados que coincidan con los filtros.
                    </td>
                  </tr>
                )}
                {data.content.map((e) => (
                  <tr key={e.id} className="group transition hover:bg-zinc-900/40">
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <span className="font-mono text-[11.5px] text-brand-300">{e.codigoEmpleado}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="text-zinc-100">{e.nombre} {e.apellido || ''}</div>
                      {e.email && <div className="mt-0.5 font-mono text-[11px] text-zinc-500">{e.email}</div>}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="text-zinc-300 capitalize">{e.area}</div>
                      {e.cargo && <div className="mt-0.5 text-[11.5px] text-zinc-500">{e.cargo}</div>}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {(e.especialidad || []).length === 0 && <span className="text-[11.5px] text-zinc-600">—</span>}
                        {(e.especialidad || []).map((m) => (
                          <Badge key={m} className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10.5px]">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      {e.nivel ? <Badge className={NIVEL_COLORS[e.nivel]}>{e.nivel}</Badge> : <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <Badge className={ESTADO_COLORS[e.estado]}>{e.estado}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {hasPermission('empleados.actualizar') && (
                          <>
                            <button
                              onClick={() => openEdit(e)}
                              className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
                            >
                              <Pencil size={11} /> Editar
                            </button>
                            <button
                              onClick={() => requestToggle(e)}
                              disabled={busyId === e.id}
                              className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 disabled:opacity-40"
                            >
                              <Power size={11} /> {e.estado === 'activo' ? 'Desactivar' : 'Activar'}
                            </button>
                          </>
                        )}
                        {hasPermission('empleados.eliminar') && (
                          <button
                            onClick={() => requestDelete(e)}
                            disabled={busyId === e.id}
                            className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11.5px] text-red-300 transition hover:border-red-500/50 hover:bg-red-500/15 disabled:opacity-40"
                          >
                            <Trash2 size={11} /> Eliminar
                          </button>
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

      <EmpleadoFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        empleado={editing}
      />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={doDelete}
        title="Eliminar empleado"
        message="Esta acción es irreversible. Si el empleado tiene tickets asignados, el backend rechazará la operación."
        details={confirmDelete ? {
          Código: confirmDelete.codigoEmpleado,
          Nombre: `${confirmDelete.nombre || ''} ${confirmDelete.apellido || ''}`.trim(),
          Área: confirmDelete.area,
          Estado: confirmDelete.estado,
        } : null}
        confirmLabel="Eliminar"
        variant="danger"
        loading={busyId === confirmDelete?.id}
        icon={Trash2}
      />

      <ConfirmDialog
        open={Boolean(confirmToggle)}
        onClose={() => setConfirmToggle(null)}
        onConfirm={doToggleEstado}
        title={confirmToggle?.estado === 'activo' ? 'Desactivar empleado' : 'Activar empleado'}
        message={
          confirmToggle?.estado === 'activo'
            ? 'El empleado quedará inactivo. No se le podrán asignar nuevos tickets mientras esté en este estado.'
            : 'El empleado volverá al estado activo y podrá recibir asignaciones.'
        }
        details={confirmToggle ? {
          Código: confirmToggle.codigoEmpleado,
          Nombre: `${confirmToggle.nombre || ''} ${confirmToggle.apellido || ''}`.trim(),
          'Estado actual': confirmToggle.estado,
          'Nuevo estado': confirmToggle.estado === 'activo' ? 'inactivo' : 'activo',
        } : null}
        confirmLabel={confirmToggle?.estado === 'activo' ? 'Desactivar' : 'Activar'}
        variant={confirmToggle?.estado === 'activo' ? 'warning' : 'info'}
        loading={busyId === confirmToggle?.id}
        icon={Power}
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

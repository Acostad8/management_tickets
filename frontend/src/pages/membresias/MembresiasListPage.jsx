import { useEffect, useMemo, useState } from 'react';
import { Search, X, Plus, Pencil, Trash2, CreditCard, CheckCircle2, Pause, XCircle, AlertTriangle, Package, Shuffle } from 'lucide-react';
import { membresiasService } from '../../services/membresias';
import { clientesService } from '../../services/clientes';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAuthStore } from '../../stores/useAuthStore';
import { MembresiaFormModal } from './MembresiaFormModal';
import { ChangeEstadoModal } from './ChangeEstadoModal';

const MODULOS = ['ventas_online', 'inventarios', 'compras', 'produccion', 'ventas_sitio'];
const ESTADOS = ['activa', 'suspendida', 'vencida', 'cancelada'];

const ESTADO_COLORS = {
  activa:     'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  suspendida: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  vencida:    'bg-red-500/10 text-red-300 border border-red-500/20',
  cancelada:  'bg-zinc-800 text-zinc-400 border border-zinc-700',
};

const formatPrecio = (n) => {
  if (n == null) return '—';
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(n));
  } catch { return `$${n}`; }
};

const diasRestantes = (fechaVenc) => {
  if (!fechaVenc) return null;
  const hoy = new Date();
  const venc = new Date(fechaVenc);
  const diff = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
  return diff;
};

export function MembresiasListPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ clienteId: '', plan: '', modulo: '', estado: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [changingEstado, setChangingEstado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const load = () => {
    setLoading(true);
    const params = { page, size: 10, sort: 'fechaCreacion,desc' };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    membresiasService.list(params)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, filters]);

  useEffect(() => {
    clientesService.list({ estado: 'activo', size: 200, sort: 'razonSocial,asc' })
      .then((d) => setClientes(d?.content || []))
      .catch(() => setClientes([]));
  }, []);

  const changeFilter = (name, value) => { setPage(0); setFilters((f) => ({ ...f, [name]: value })); };
  const activeFilters = Object.entries(filters).filter(([, v]) => v);
  const clearFilters = () => { setPage(0); setFilters({ clienteId: '', plan: '', modulo: '', estado: '' }); };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (m) => { setEditing(m); setModalOpen(true); };

  const openChangeEstado = (m) => setChangingEstado(m);
  const requestDelete = (m) => setConfirmDelete(m);

  const doDelete = async () => {
    const m = confirmDelete;
    if (!m) return;
    setError(''); setBusyId(m.id);
    try {
      await membresiasService.remove(m.id);
      load();
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo eliminar. Verifica pagos asociados.');
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const rows = data?.content || [];
    return {
      total: data?.totalElements ?? 0,
      activas: rows.filter((m) => m.estado === 'activa').length,
      suspendidas: rows.filter((m) => m.estado === 'suspendida').length,
      vencidas: rows.filter((m) => m.estado === 'vencida').length,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-zinc-50">
            Membresías
          </h1>
          <p className="mt-1.5 text-[13.5px] text-zinc-400">
            Planes contratados por cada cliente con sus módulos ERP activos y vigencia.
          </p>
        </div>
        {hasPermission('membresias.crear') && (
          <button onClick={openCreate} className="btn-primary self-start sm:self-end">
            <Plus size={14} /> Nueva membresía
          </button>
        )}
      </header>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-900 bg-zinc-900 lg:grid-cols-4">
        <StatMini icon={CreditCard} label="Total" value={stats.total} />
        <StatMini icon={CheckCircle2} label="Activas (página)" value={stats.activas} accent="text-emerald-400" />
        <StatMini icon={Pause} label="Suspendidas (página)" value={stats.suspendidas} accent="text-amber-400" />
        <StatMini icon={AlertTriangle} label="Vencidas (página)" value={stats.vencidas} accent="text-red-400" />
      </section>

      <section className="border border-zinc-900 bg-zinc-950">
        <div className="grid grid-cols-1 gap-px bg-zinc-900 sm:grid-cols-4">
          <div className="bg-zinc-950 p-3">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Cliente
            </label>
            <select
              value={filters.clienteId}
              onChange={(e) => changeFilter('clienteId', e.target.value)}
              className="h-8 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2 text-[12.5px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
            >
              <option value="">Todos</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.razonSocial}</option>)}
            </select>
          </div>
          <FilterInput label="Plan" icon={Search} value={filters.plan} placeholder="buscar..." onChange={(v) => changeFilter('plan', v)} />
          <FilterSelect label="Módulo" value={filters.modulo} options={MODULOS} onChange={(v) => changeFilter('modulo', v)} />
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
                {k === 'clienteId' ? 'cliente' : k}: {k === 'clienteId' ? (clientes.find(c => c.id === v)?.razonSocial || v) : v} <X size={11} className="text-zinc-500" />
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
          {loading ? 'Cargando…' : data ? `${data.totalElements} membresía(s)` : ''}
        </span>
      </div>

      {data && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
            <table className="min-w-full divide-y divide-zinc-900 text-[13px]">
              <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3 text-left">Cliente · Plan</th>
                  <th className="px-4 py-3 text-left">Módulos</th>
                  <th className="px-4 py-3 text-left">Vigencia</th>
                  <th className="px-4 py-3 text-left">Precio</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {data.content.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                      No hay membresías que coincidan con los filtros.
                    </td>
                  </tr>
                )}
                {data.content.map((m) => {
                  const dias = diasRestantes(m.fechaVencimiento);
                  const alerta = dias != null && dias >= 0 && dias <= 15 && m.estado === 'activa';
                  return (
                    <tr key={m.id} className="group transition hover:bg-zinc-900/40">
                      <td className="px-4 py-3 align-middle">
                        <div className="text-zinc-100">{m.clienteRazonSocial || <span className="font-mono text-[11.5px] text-zinc-500">{m.clienteId}</span>}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-brand-300">{m.plan}</div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {(m.modulosContratados || []).length === 0 && <span className="text-[11.5px] text-zinc-600">—</span>}
                          {(m.modulosContratados || []).map((mod) => (
                            <Badge key={mod} className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10.5px]">
                              {mod}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle">
                        <div className="font-mono text-[11.5px] text-zinc-300">
                          {m.fechaInicio || '—'} <span className="text-zinc-600">→</span> {m.fechaVencimiento || '—'}
                        </div>
                        {dias != null && (
                          <div className={`mt-0.5 text-[11px] ${dias < 0 ? 'text-red-300' : alerta ? 'text-amber-300' : 'text-zinc-500'}`}>
                            {dias < 0 ? `vencida hace ${-dias} día(s)` : `${dias} día(s) restantes`}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle">
                        <span className="font-mono text-[12px] tabular-nums text-zinc-200">{formatPrecio(m.precio)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle">
                        <Badge className={ESTADO_COLORS[m.estado]}>{m.estado}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {hasPermission('membresias.actualizar') && (
                            <>
                              <button
                                onClick={() => openEdit(m)}
                                className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
                              >
                                <Pencil size={11} /> Editar
                              </button>
                              <button
                                onClick={() => openChangeEstado(m)}
                                disabled={busyId === m.id}
                                className="inline-flex items-center gap-1 rounded-md border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[11.5px] text-brand-200 transition hover:border-brand-500/50 hover:bg-brand-500/15 disabled:opacity-40"
                              >
                                <Shuffle size={11} /> Cambiar estado
                              </button>
                            </>
                          )}
                          {hasPermission('membresias.eliminar') && (
                            <button
                              onClick={() => requestDelete(m)}
                              disabled={busyId === m.id}
                              className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11.5px] text-red-300 transition hover:border-red-500/50 hover:bg-red-500/15 disabled:opacity-40"
                            >
                              <Trash2 size={11} /> Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      <MembresiaFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        membresia={editing}
      />

      <ChangeEstadoModal
        open={Boolean(changingEstado)}
        onClose={() => setChangingEstado(null)}
        onSaved={load}
        membresia={changingEstado}
      />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={doDelete}
        title="Eliminar membresía"
        message="Esta acción es irreversible. Si la membresía tiene pagos asociados, el backend puede rechazar la operación."
        details={confirmDelete ? {
          Plan: confirmDelete.plan,
          Cliente: confirmDelete.clienteRazonSocial || confirmDelete.clienteId,
          Estado: confirmDelete.estado,
          Vencimiento: confirmDelete.fechaVencimiento || '—',
        } : null}
        confirmLabel="Eliminar"
        variant="danger"
        loading={busyId === confirmDelete?.id}
        icon={Trash2}
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

import { useEffect, useMemo, useState } from 'react';
import { Search, X, Plus, Pencil, Trash2, Ban, DollarSign, CheckCircle2, XCircle, Receipt } from 'lucide-react';
import { pagosService } from '../../services/pagos';
import { clientesService } from '../../services/clientes';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useAuthStore } from '../../stores/useAuthStore';
import { PagoFormModal } from './PagoFormModal';
import { AnularPagoModal } from './AnularPagoModal';

const MEDIOS = ['efectivo', 'transferencia', 'tarjeta', 'pse', 'cheque', 'otro'];
const ESTADOS = ['registrado', 'anulado'];

const ESTADO_COLORS = {
  registrado: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  anulado:    'bg-red-500/10 text-red-300 border border-red-500/20',
};

const MEDIO_COLORS = {
  efectivo:      'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  transferencia: 'bg-brand-500/10 text-brand-300 border border-brand-500/20',
  tarjeta:       'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  pse:           'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
  cheque:        'bg-zinc-800 text-zinc-300 border border-zinc-700',
  otro:          'bg-zinc-800 text-zinc-400 border border-zinc-700',
};

const formatMoney = (n) => {
  if (n == null) return '—';
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(n));
  } catch { return `$${n}`; }
};

export function PagosListPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ clienteId: '', medioPago: '', estado: '', desde: '', hasta: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [anularOpen, setAnularOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [anulando, setAnulando] = useState(null);
  const [clientes, setClientes] = useState([]);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const load = () => {
    setLoading(true);
    const params = { page, size: 10, sort: 'fechaPago,desc' };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    pagosService.list(params)
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
  const clearFilters = () => { setPage(0); setFilters({ clienteId: '', medioPago: '', estado: '', desde: '', hasta: '' }); };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setModalOpen(true); };
  const openAnular = (p) => { setAnulando(p); setAnularOpen(true); };

  const remove = async (p) => {
    if (!window.confirm(`¿Eliminar pago anulado por ${formatMoney(p.valor)}?`)) return;
    setError(''); setBusyId(p.id);
    try {
      await pagosService.remove(p.id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo eliminar el pago.');
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const rows = data?.content || [];
    const totalPaginaValor = rows
      .filter((p) => p.estado === 'registrado')
      .reduce((acc, p) => acc + Number(p.valor || 0), 0);
    return {
      total: data?.totalElements ?? 0,
      registrados: rows.filter((p) => p.estado === 'registrado').length,
      anulados: rows.filter((p) => p.estado === 'anulado').length,
      valorPagina: totalPaginaValor,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-zinc-50">
            Pagos
          </h1>
          <p className="mt-1.5 text-[13.5px] text-zinc-400">
            Historial de pagos de clientes. Al asociarse a una membresía la actualización es atómica (HU25).
          </p>
        </div>
        {hasPermission('pagos.crear') && (
          <button onClick={openCreate} className="btn-primary self-start sm:self-end">
            <Plus size={14} /> Registrar pago
          </button>
        )}
      </header>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-900 bg-zinc-900 lg:grid-cols-4">
        <StatMini icon={Receipt} label="Total" value={stats.total} />
        <StatMini icon={CheckCircle2} label="Registrados (página)" value={stats.registrados} accent="text-emerald-400" />
        <StatMini icon={XCircle} label="Anulados (página)" value={stats.anulados} accent="text-red-400" />
        <StatMini icon={DollarSign} label="Valor página" value={formatMoney(stats.valorPagina)} accent="text-brand-400" />
      </section>

      <section className="border border-zinc-900 bg-zinc-950">
        <div className="grid grid-cols-1 gap-px bg-zinc-900 sm:grid-cols-5">
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
          <FilterSelect label="Medio" value={filters.medioPago} options={MEDIOS} onChange={(v) => changeFilter('medioPago', v)} />
          <FilterSelect label="Estado" value={filters.estado} options={ESTADOS} onChange={(v) => changeFilter('estado', v)} />
          <FilterInput label="Desde" type="date" value={filters.desde} onChange={(v) => changeFilter('desde', v)} />
          <FilterInput label="Hasta" type="date" value={filters.hasta} onChange={(v) => changeFilter('hasta', v)} />
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
                {k === 'clienteId' ? 'cliente' : k}: {k === 'clienteId' ? (clientes.find(c => c.id === v)?.razonSocial || v) : v}
                <X size={11} className="text-zinc-500" />
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
          {loading ? 'Cargando…' : data ? `${data.totalElements} pago(s)` : ''}
        </span>
      </div>

      {data && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
            <table className="min-w-full divide-y divide-zinc-900 text-[13px]">
              <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Cliente · Membresía</th>
                  <th className="px-4 py-3 text-left">Medio</th>
                  <th className="px-4 py-3 text-left">Referencia</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {data.content.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                      No hay pagos que coincidan con los filtros.
                    </td>
                  </tr>
                )}
                {data.content.map((p) => (
                  <tr key={p.id} className={`group transition hover:bg-zinc-900/40 ${p.estado === 'anulado' ? 'opacity-60' : ''}`}>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <span className="font-mono text-[12px] text-zinc-200">{p.fechaPago}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="text-zinc-100">{p.clienteRazonSocial || <span className="font-mono text-[11.5px] text-zinc-500">{p.clienteId}</span>}</div>
                      {p.membresiaPlan && (
                        <div className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-brand-300">
                          <Receipt size={10} /> {p.membresiaPlan}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <Badge className={MEDIO_COLORS[p.medioPago] || MEDIO_COLORS.otro}>{p.medioPago}</Badge>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      {p.referencia ? (
                        <span className="font-mono text-[11.5px] text-zinc-300">{p.referencia}</span>
                      ) : <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                      <span className="font-mono text-[12.5px] font-semibold tabular-nums text-zinc-100">{formatMoney(p.valor)}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <Badge className={ESTADO_COLORS[p.estado]}>{p.estado}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {hasPermission('pagos.actualizar') && p.estado === 'registrado' && (
                          <>
                            <button
                              onClick={() => openEdit(p)}
                              className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
                            >
                              <Pencil size={11} /> Editar
                            </button>
                            <button
                              onClick={() => openAnular(p)}
                              className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11.5px] text-amber-300 transition hover:border-amber-500/50 hover:bg-amber-500/15"
                            >
                              <Ban size={11} /> Anular
                            </button>
                          </>
                        )}
                        {hasPermission('pagos.eliminar') && p.estado === 'anulado' && (
                          <button
                            onClick={() => remove(p)}
                            disabled={busyId === p.id}
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

      <PagoFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        pago={editing}
      />

      <AnularPagoModal
        open={anularOpen}
        onClose={() => setAnularOpen(false)}
        onAnulado={load}
        pago={anulando}
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
      <div className="mt-2 text-xl font-semibold tabular-nums tracking-tight text-zinc-50">{value}</div>
    </div>
  );
}

function FilterInput({ label, value, onChange, type = 'text' }) {
  return (
    <div className="bg-zinc-950 p-3">
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 text-[12.5px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
      />
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

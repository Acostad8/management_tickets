import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { ticketsService, ESTADOS, PRIORIDADES, MODULOS, ESTADO_COLORS, PRIORIDAD_COLORS } from '../../services/tickets';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { useAuthStore } from '../../stores/useAuthStore';

export function TicketsListPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ estado: '', modulo: '', prioridad: '', codigo: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  useEffect(() => {
    setLoading(true);
    const params = { page, size: 10, sort: 'fechaCreacion,desc' };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    ticketsService.list(params)
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, filters]);

  const changeFilter = (name, value) => { setPage(0); setFilters((f) => ({ ...f, [name]: value })); };

  const columns = [
    { key: 'codigo',   header: 'Código', render: (r) => <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{r.codigo}</span> },
    { key: 'titulo',   header: 'Título' },
    { key: 'modulo',   header: 'Módulo' },
    { key: 'estado',   header: 'Estado',    render: (r) => <Badge className={ESTADO_COLORS[r.estado]}>{r.estado}</Badge> },
    { key: 'prioridad',header: 'Prioridad', render: (r) => <Badge className={PRIORIDAD_COLORS[r.prioridad]}>{r.prioridad}</Badge> },
    { key: 'fecha',    header: 'Creado',    render: (r) => new Date(r.fechaCreacion).toLocaleDateString() },
    { key: 'acciones', header: '',          render: (r) => <Link to={`/tickets/${r.id}`} className="text-brand-600 hover:underline">Ver</Link> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Tickets</h2>
        {hasPermission('tickets.crear') && (
          <Link to="/tickets/nuevo" className="btn-primary">
            <Plus size={16} /> Nuevo ticket
          </Link>
        )}
      </div>

      <div className="card">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Filter size={14} /> Filtros
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input className="input" placeholder="Código (TK-...)" value={filters.codigo}
                 onChange={(e) => changeFilter('codigo', e.target.value)} />
          <select className="input" value={filters.estado} onChange={(e) => changeFilter('estado', e.target.value)}>
            <option value="">Estado (todos)</option>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select className="input" value={filters.modulo} onChange={(e) => changeFilter('modulo', e.target.value)}>
            <option value="">Módulo (todos)</option>
            {MODULOS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="input" value={filters.prioridad} onChange={(e) => changeFilter('prioridad', e.target.value)}>
            <option value="">Prioridad (todas)</option>
            {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {loading && <div className="animate-pulse text-sm text-slate-500">Cargando tickets...</div>}
      {data && (
        <>
          <div className="text-xs text-slate-500 dark:text-slate-400">{data.totalElements} resultado(s)</div>
          <DataTable columns={columns} rows={data.content} empty="No hay tickets" />
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

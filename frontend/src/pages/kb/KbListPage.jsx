import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, BookOpen } from 'lucide-react';
import { kbService, MODULOS_KB, ESTADOS_ARTICULO } from '../../services/kb';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useAuthStore } from '../../stores/useAuthStore';

export function KbListPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [q, setQ] = useState('');
  const [modulo, setModulo] = useState('');
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    const params = { page, size: 9, sort: 'fechaActualizacion,desc' };
    if (modulo) params.modulo = modulo;
    if (estado) params.estado = estado;
    const promise = q.trim()
      ? kbService.search(q.trim(), params)
      : kbService.list(params);
    promise.then(setData).finally(() => setLoading(false));
  };

  useEffect(load, [page, modulo, estado]);

  const onSearch = (e) => { e.preventDefault(); setPage(0); load(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Base de Conocimiento</h2>
        {hasPermission('base_conocimiento.crear') && (
          <Link to="/base-conocimiento/nuevo" className="btn-primary">
            <Plus size={16} /> Nuevo artículo
          </Link>
        )}
      </div>

      <form onSubmit={onSearch} className="card space-y-3">
        <div className="flex gap-2">
          <input className="input flex-1" placeholder="Buscar en texto completo..."
                 value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="submit" className="btn-primary">
            <Search size={16} /> Buscar
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select className="input" value={modulo} onChange={(e) => { setPage(0); setModulo(e.target.value); }}>
            <option value="">Módulo (todos)</option>
            {MODULOS_KB.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {hasPermission('base_conocimiento.actualizar') && (
            <select className="input" value={estado} onChange={(e) => { setPage(0); setEstado(e.target.value); }}>
              <option value="">Estado (todos)</option>
              {ESTADOS_ARTICULO.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          )}
        </div>
      </form>

      {loading && <div className="animate-pulse text-sm text-slate-500">Cargando...</div>}
      {data && (
        <>
          <div className="text-xs text-slate-500 dark:text-slate-400">{data.totalElements} artículo(s)</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.content.length === 0 && <div className="col-span-full text-center text-sm text-slate-500">Sin resultados</div>}
            {data.content.map((a) => (
              <Link to={`/base-conocimiento/${a.id}`} key={a.id}
                    className="card transition hover:border-brand-400 hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <BookOpen size={14} className="text-brand-500" />
                  <Badge className={a.estado === 'publicado' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}>{a.estado}</Badge>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{a.titulo}</h3>
                <div className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                  Módulo: <span className="font-mono">{a.modulo}</span> · {a.vistas || 0} vistas
                </div>
                {a.etiquetas?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {a.etiquetas.slice(0, 3).map((t) => (
                      <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">#{t}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

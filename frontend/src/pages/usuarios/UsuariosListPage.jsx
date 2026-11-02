import { useEffect, useState } from 'react';
import { usuariosService } from '../../services/usuarios';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { Unlock } from 'lucide-react';

const ESTADO_COLORS = {
  activo:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  inactivo:  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  bloqueado: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
};

export function UsuariosListPage() {
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState('');
  const [data, setData] = useState(null);

  const load = () => {
    const params = { page, size: 10, sort: 'email,asc' };
    if (email) params.email = email;
    usuariosService.list(params).then(setData);
  };

  useEffect(load, [page, email]);

  const unlock = async (id) => {
    try {
      await usuariosService.unlock(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al desbloquear');
    }
  };

  const columns = [
    { key: 'email',  header: 'Email' },
    { key: 'nombre', header: 'Nombre', render: (r) => `${r.nombre} ${r.apellido || ''}` },
    { key: 'roles',  header: 'Roles',  render: (r) => (r.roles || []).map((rol) => <Badge key={rol} className="mr-1 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">{rol}</Badge>) },
    { key: 'estado', header: 'Estado', render: (r) => <Badge className={ESTADO_COLORS[r.estado]}>{r.estado}</Badge> },
    { key: 'intentos', header: 'Intentos fallidos', render: (r) => r.intentosFallidos || 0 },
    { key: 'accion', header: '', render: (r) => r.estado === 'bloqueado' ? (
        <button onClick={() => unlock(r.id)} className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline">
          <Unlock size={12} /> Desbloquear
        </button>
      ) : null },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Usuarios</h2>
      <div className="card">
        <input className="input max-w-md" placeholder="Buscar por email..." value={email}
               onChange={(e) => { setPage(0); setEmail(e.target.value); }} />
      </div>
      {data && (
        <>
          <div className="text-xs text-slate-500 dark:text-slate-400">{data.totalElements} usuario(s)</div>
          <DataTable columns={columns} rows={data.content} empty="No hay usuarios" />
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

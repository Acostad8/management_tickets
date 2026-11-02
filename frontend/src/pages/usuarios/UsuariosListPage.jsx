import { useEffect, useMemo, useState } from 'react';
import { Search, Unlock, X, UserPlus, UserCheck, UserX, ShieldAlert, Users, Trash2, Power } from 'lucide-react';
import { usuariosService } from '../../services/usuarios';
import { rolesService } from '../../services/roles';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAuthStore } from '../../stores/useAuthStore';

const ESTADOS = ['activo', 'inactivo', 'bloqueado'];

const ESTADO_COLORS = {
  activo:    'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  inactivo:  'bg-zinc-800 text-zinc-400 border border-zinc-700',
  bloqueado: 'bg-red-500/10 text-red-300 border border-red-500/20',
};

export function UsuariosListPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ email: '', estado: '', rol: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);
  const [confirmUnlock, setConfirmUnlock] = useState(null);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const load = () => {
    setLoading(true);
    const params = { page, size: 10, sort: 'email,asc' };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    usuariosService.list(params)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, filters]);

  useEffect(() => {
    rolesService.list(true).then((rs) => setRoles(rs || [])).catch(() => setRoles([]));
  }, []);

  const changeFilter = (name, value) => { setPage(0); setFilters((f) => ({ ...f, [name]: value })); };
  const activeFilters = Object.entries(filters).filter(([, v]) => v);
  const clearFilters = () => { setPage(0); setFilters({ email: '', estado: '', rol: '' }); };

  const requestUnlock = (u) => setConfirmUnlock(u);
  const requestToggle = (u) => setConfirmToggle(u);
  const requestDelete = (u) => setConfirmDelete(u);

  const doUnlock = async () => {
    const u = confirmUnlock;
    if (!u) return;
    setError(''); setBusyId(u.id);
    try {
      await usuariosService.unlock(u.id);
      load();
      setConfirmUnlock(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo desbloquear el usuario.');
    } finally {
      setBusyId(null);
    }
  };

  const doToggleEstado = async () => {
    const u = confirmToggle;
    if (!u) return;
    setError(''); setBusyId(u.id);
    const next = u.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await usuariosService.cambiarEstado(u.id, next);
      load();
      setConfirmToggle(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cambiar el estado.');
    } finally {
      setBusyId(null);
    }
  };

  const doDelete = async () => {
    const u = confirmDelete;
    if (!u) return;
    setError(''); setBusyId(u.id);
    try {
      await usuariosService.remove(u.id);
      load();
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo eliminar. El usuario puede tener tickets o datos relacionados.');
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const rows = data?.content || [];
    return {
      total: data?.totalElements ?? 0,
      activos: rows.filter((u) => u.estado === 'activo').length,
      bloqueados: rows.filter((u) => u.estado === 'bloqueado').length,
      inactivos: rows.filter((u) => u.estado === 'inactivo').length,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-zinc-50">
            Usuarios
          </h1>
          <p className="mt-1.5 text-[13.5px] text-zinc-400">
            Cuentas con acceso al sistema, su estado y los roles asignados.
          </p>
        </div>
        {hasPermission('usuarios.crear') && (
          <button className="btn-primary self-start sm:self-end" disabled title="Alta en progreso">
            <UserPlus size={14} /> Nuevo usuario
          </button>
        )}
      </header>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-900 bg-zinc-900 lg:grid-cols-4">
        <StatMini icon={Users} label="Total" value={stats.total} />
        <StatMini icon={UserCheck} label="Activos (página)" value={stats.activos} accent="text-emerald-400" />
        <StatMini icon={UserX} label="Inactivos (página)" value={stats.inactivos} accent="text-zinc-400" />
        <StatMini icon={ShieldAlert} label="Bloqueados (página)" value={stats.bloqueados} accent="text-red-400" />
      </section>

      <section className="border border-zinc-900 bg-zinc-950">
        <div className="grid grid-cols-1 gap-px bg-zinc-900 sm:grid-cols-3">
          <FilterInput
            label="Email"
            icon={Search}
            value={filters.email}
            placeholder="correo@..."
            onChange={(v) => changeFilter('email', v)}
          />
          <FilterSelect
            label="Estado"
            value={filters.estado}
            options={ESTADOS}
            onChange={(v) => changeFilter('estado', v)}
          />
          <FilterSelect
            label="Rol"
            value={filters.rol}
            options={roles.map((r) => r.nombre || r.codigo || r)}
            onChange={(v) => changeFilter('rol', v)}
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

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[12.5px] text-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[11.5px] text-zinc-500">
          {loading ? 'Cargando…' : data ? `${data.totalElements} usuario(s)` : ''}
        </span>
      </div>

      {data && (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
            <table className="min-w-full divide-y divide-zinc-900 text-[13px]">
              <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Roles</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Intentos</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {data.content.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                      No hay usuarios que coincidan con los filtros.
                    </td>
                  </tr>
                )}
                {data.content.map((u) => (
                  <tr key={u.id} className="group transition hover:bg-zinc-900/40">
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <span className="font-mono text-[12px] text-zinc-200">{u.email}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="text-zinc-300">{u.nombre} {u.apellido || ''}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {(u.roles || []).map((rol) => (
                          <Badge key={rol} className="bg-brand-500/10 text-brand-300 border border-brand-500/20 font-mono text-[10.5px] uppercase tracking-wider">
                            {rol}
                          </Badge>
                        ))}
                        {(!u.roles || u.roles.length === 0) && (
                          <span className="text-[11.5px] text-zinc-600">—</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <Badge className={ESTADO_COLORS[u.estado]}>{u.estado}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">
                      <IntentosBadge n={u.intentosFallidos || 0} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {u.estado === 'bloqueado' && hasPermission('usuarios.actualizar') && (
                          <button
                            onClick={() => requestUnlock(u)}
                            disabled={busyId === u.id}
                            className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11.5px] text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/15 disabled:opacity-40"
                          >
                            <Unlock size={11} /> Desbloquear
                          </button>
                        )}
                        {u.estado !== 'bloqueado' && hasPermission('usuarios.actualizar') && (
                          <button
                            onClick={() => requestToggle(u)}
                            disabled={busyId === u.id}
                            className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 disabled:opacity-40"
                          >
                            {u.estado === 'activo' ? <><UserX size={11} /> Desactivar</> : <><UserCheck size={11} /> Activar</>}
                          </button>
                        )}
                        {hasPermission('usuarios.eliminar') && (
                          <button
                            onClick={() => requestDelete(u)}
                            disabled={busyId === u.id}
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

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={doDelete}
        title="Eliminar usuario"
        message="Esta acción es irreversible. El usuario perderá acceso al sistema permanentemente. Si tiene tickets o datos asociados el backend puede rechazar la operación."
        details={confirmDelete ? {
          Email: confirmDelete.email,
          Nombre: `${confirmDelete.nombre || ''} ${confirmDelete.apellido || ''}`.trim(),
          Roles: (confirmDelete.roles || []).join(', ') || '—',
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
        title={confirmToggle?.estado === 'activo' ? 'Desactivar usuario' : 'Activar usuario'}
        message={
          confirmToggle?.estado === 'activo'
            ? 'El usuario quedará inactivo y no podrá iniciar sesión mientras esté en este estado.'
            : 'El usuario volverá al estado activo y podrá iniciar sesión nuevamente. Se reiniciarán los intentos fallidos.'
        }
        details={confirmToggle ? {
          Email: confirmToggle.email,
          Nombre: `${confirmToggle.nombre || ''} ${confirmToggle.apellido || ''}`.trim(),
          'Estado actual': confirmToggle.estado,
          'Nuevo estado': confirmToggle.estado === 'activo' ? 'inactivo' : 'activo',
        } : null}
        confirmLabel={confirmToggle?.estado === 'activo' ? 'Desactivar' : 'Activar'}
        variant={confirmToggle?.estado === 'activo' ? 'warning' : 'info'}
        loading={busyId === confirmToggle?.id}
        icon={Power}
      />

      <ConfirmDialog
        open={Boolean(confirmUnlock)}
        onClose={() => setConfirmUnlock(null)}
        onConfirm={doUnlock}
        title="Desbloquear usuario"
        message="El contador de intentos fallidos se reiniciará y el usuario podrá volver a iniciar sesión."
        details={confirmUnlock ? {
          Email: confirmUnlock.email,
          Nombre: `${confirmUnlock.nombre || ''} ${confirmUnlock.apellido || ''}`.trim(),
          'Intentos fallidos': `${confirmUnlock.intentosFallidos || 0} / 5`,
        } : null}
        confirmLabel="Desbloquear"
        variant="info"
        loading={busyId === confirmUnlock?.id}
        icon={Unlock}
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

function IntentosBadge({ n }) {
  if (n === 0) return <span className="font-mono text-[11.5px] text-zinc-600">0</span>;
  const danger = n >= 3;
  return (
    <span className={`font-mono text-[11.5px] tabular-nums ${danger ? 'text-red-300' : 'text-amber-300'}`}>
      {n} / 5
    </span>
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

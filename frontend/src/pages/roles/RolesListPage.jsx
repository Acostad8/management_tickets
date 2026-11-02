import { useEffect, useState } from 'react';
import { rolesService } from '../../services/roles';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';

export function RolesListPage() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    rolesService.list().then(setRoles);
    rolesService.catalogoPermisos().then(setPermisos);
  }, []);

  const columns = [
    { key: 'codigo',    header: 'Código' },
    { key: 'nombre',    header: 'Nombre' },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'permisos',  header: 'Permisos', render: (r) => <span className="text-xs text-slate-500">{r.permisos?.length || 0}</span> },
    { key: 'activo',    header: 'Activo',   render: (r) => <Badge className={r.activo ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-700'}>{r.activo ? 'sí' : 'no'}</Badge> },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Roles</h2>
      <DataTable columns={columns} rows={roles} empty="Sin roles" />

      <div className="card">
        <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">Catálogo de permisos disponibles ({permisos.length})</h3>
        <div className="flex flex-wrap gap-1">
          {permisos.map((p) => (
            <code key={p} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{p}</code>
          ))}
        </div>
      </div>
    </div>
  );
}

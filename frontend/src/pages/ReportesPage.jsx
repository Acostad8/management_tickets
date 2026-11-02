import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { DataTable } from '../components/ui/DataTable';

export function ReportesPage() {
  const [porCliente, setPorCliente] = useState([]);
  const [porEmpleado, setPorEmpleado] = useState([]);
  const [tiempoResolucion, setTiempoResolucion] = useState([]);
  const [porDia, setPorDia] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/reportes/tickets-por-cliente?limit=10').then((r) => r.data),
      api.get('/reportes/tickets-por-empleado?limit=10').then((r) => r.data),
      api.get('/reportes/tiempo-resolucion-modulo').then((r) => r.data),
      api.get('/dashboard/tickets-por-dia').then((r) => r.data),
    ]).then(([c, e, t, d]) => { setPorCliente(c); setPorEmpleado(e); setTiempoResolucion(t); setPorDia(d); });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Reportes y Analytics</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Reportes generados con el Aggregation Framework de MongoDB: $match, $group, $sort, $project, $lookup.
      </p>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Top clientes por tickets ($lookup clientes)</h3>
        <DataTable
          columns={[
            { key: 'nit', header: 'NIT' },
            { key: 'razonSocial', header: 'Razón social' },
            { key: 'totalTickets', header: 'Total' },
            { key: 'ticketsAbiertos', header: 'Abiertos' },
            { key: 'ticketsResueltos', header: 'Resueltos' },
          ]}
          rows={porCliente}
          empty="Sin datos"
        />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Top empleados por asignaciones ($lookup empleados)</h3>
        <DataTable
          columns={[
            { key: 'codigoEmpleado', header: 'Código' },
            { key: 'nombre', header: 'Nombre', render: (r) => `${r.nombre || ''} ${r.apellido || ''}` },
            { key: 'area', header: 'Área' },
            { key: 'totalAsignados', header: 'Asignados' },
            { key: 'resueltos', header: 'Resueltos' },
            { key: 'enProceso', header: 'En proceso' },
          ]}
          rows={porEmpleado}
          empty="Sin datos"
        />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Tiempo promedio de resolución por módulo</h3>
        <DataTable
          columns={[
            { key: 'modulo', header: 'Módulo' },
            { key: 'ticketsResueltos', header: 'Resueltos' },
            { key: 'promedioHoras', header: 'Promedio (horas)', render: (r) => r.promedioHoras?.toFixed(2) ?? '—' },
          ]}
          rows={tiempoResolucion}
          empty="Aún no hay tickets resueltos con fechaCierre registrada"
        />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Tickets creados por día</h3>
        <DataTable
          columns={[
            { key: 'fecha', header: 'Fecha' },
            { key: 'count', header: 'Tickets' },
          ]}
          rows={porDia}
          empty="Sin datos"
        />
      </section>
    </div>
  );
}

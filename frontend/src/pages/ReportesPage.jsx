import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Users, UserCog, Timer, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import { Badge } from '../components/ui/Badge';
import { TicketsPorDiaChart } from './dashboard/TicketsPorDiaChart';

const MODULO_COLORS = {
  ventas_online: 'bg-indigo-500',
  inventarios:   'bg-emerald-500',
  compras:       'bg-amber-500',
  produccion:    'bg-rose-500',
  ventas_sitio:  'bg-cyan-500',
};

export function ReportesPage() {
  const [porCliente, setPorCliente] = useState([]);
  const [porEmpleado, setPorEmpleado] = useState([]);
  const [tiempoResolucion, setTiempoResolucion] = useState([]);
  const [porDia, setPorDia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/reportes/tickets-por-cliente?limit=10').then((r) => r.data).catch(() => []),
      api.get('/reportes/tickets-por-empleado?limit=10').then((r) => r.data).catch(() => []),
      api.get('/reportes/tiempo-resolucion-modulo').then((r) => r.data).catch(() => []),
      api.get('/dashboard/tickets-por-dia').then((r) => r.data).catch(() => []),
    ])
      .then(([c, e, t, d]) => {
        setPorCliente(c || []);
        setPorEmpleado(e || []);
        setTiempoResolucion(t || []);
        setPorDia((d || []).slice(-14));
      })
      .catch((err) => setError(err.response?.data?.message || 'Error cargando reportes'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const totales = useMemo(() => {
    const totalClientes = porCliente.length;
    const totalTickets = porCliente.reduce((acc, c) => acc + (c.totalTickets || 0), 0);
    const totalEmpleadosActivos = porEmpleado.filter((e) => (e.totalAsignados || 0) > 0).length;
    const promedioHoras = tiempoResolucion.length > 0
      ? tiempoResolucion.reduce((acc, t) => acc + (t.promedioHoras || 0), 0) / tiempoResolucion.length
      : 0;
    return { totalClientes, totalTickets, totalEmpleadosActivos, promedioHoras };
  }, [porCliente, porEmpleado, tiempoResolucion]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-zinc-50">
            Reportes y analytics
          </h1>
          <p className="mt-1.5 text-[13.5px] text-zinc-400">
            Agregaciones sobre MongoDB — $match, $group, $sort, $project, $lookup.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10.5px]">$match</Badge>
            <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10.5px]">$group</Badge>
            <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10.5px]">$sort</Badge>
            <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10.5px]">$project</Badge>
            <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10.5px]">$lookup</Badge>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="btn-secondary self-start sm:self-end disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </header>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[12.5px] text-red-200">
          {error}
        </div>
      )}

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-900 bg-zinc-900 lg:grid-cols-4">
        <StatMini icon={Users} label="Clientes con tickets" value={totales.totalClientes} accent="text-brand-400" />
        <StatMini icon={BarChart3} label="Tickets agregados" value={totales.totalTickets} accent="text-sky-400" />
        <StatMini icon={UserCog} label="Empleados con carga" value={totales.totalEmpleadosActivos} accent="text-emerald-400" />
        <StatMini icon={Timer} label="Resolución promedio" value={`${totales.promedioHoras.toFixed(1)}h`} accent="text-amber-400" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TicketsPorDiaChart data={porDia} />
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-5">
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Tiempo de resolución por módulo
          </h3>
          <ul className="space-y-3">
            {tiempoResolucion.length === 0 && (
              <li className="text-[12.5px] text-zinc-500">
                Aún no hay tickets resueltos con fecha de cierre registrada.
              </li>
            )}
            {tiempoResolucion.map((t) => {
              const horas = Number(t.promedioHoras || 0);
              const color = MODULO_COLORS[t.modulo] || 'bg-brand-500';
              const maxHoras = Math.max(1, ...tiempoResolucion.map((x) => x.promedioHoras || 0));
              const pct = Math.max(4, (horas / maxHoras) * 100);
              return (
                <li key={t.modulo}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="font-mono text-zinc-300">{t.modulo}</span>
                    <span className="font-mono tabular-nums text-zinc-100">{horas.toFixed(2)}h</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500">
                    {t.ticketsResueltos} ticket(s) resuelto(s)
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section>
        <SectionHeader
          icon={Users}
          title="Top clientes por tickets abiertos"
          subtitle="$group por clienteId + $lookup a clientes para traer NIT y razón social."
          count={porCliente.length}
        />
        <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
          <table className="min-w-full divide-y divide-zinc-900 text-[13px]">
            <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">NIT</th>
                <th className="px-4 py-3 text-left">Razón social</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Abiertos</th>
                <th className="px-4 py-3 text-right">Resueltos</th>
                <th className="px-4 py-3 text-left">Distribución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {porCliente.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-500">Sin datos para el pipeline.</td></tr>
              )}
              {porCliente.map((c, i) => {
                const total = Number(c.totalTickets || 0);
                const abiertos = Number(c.ticketsAbiertos || 0);
                const resueltos = Number(c.ticketsResueltos || 0);
                const pctAbierto = total > 0 ? (abiertos / total) * 100 : 0;
                const pctResuelto = total > 0 ? (resueltos / total) * 100 : 0;
                return (
                  <tr key={c.nit || i} className="hover:bg-zinc-900/40">
                    <td className="px-4 py-3 font-mono text-[11px] text-zinc-500">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-3 font-mono text-[11.5px] text-zinc-300">{c.nit || '—'}</td>
                    <td className="px-4 py-3 text-zinc-100">{c.razonSocial || <span className="text-zinc-600">—</span>}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-100">{total}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-amber-300">{abiertos}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-300">{resueltos}</td>
                    <td className="px-4 py-3">
                      <div className="flex h-1.5 overflow-hidden rounded-full bg-zinc-900">
                        <div className="h-full bg-amber-500" style={{ width: `${pctAbierto}%` }} title={`Abiertos: ${pctAbierto.toFixed(0)}%`} />
                        <div className="h-full bg-emerald-500" style={{ width: `${pctResuelto}%` }} title={`Resueltos: ${pctResuelto.toFixed(0)}%`} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader
          icon={UserCog}
          title="Top empleados por asignaciones"
          subtitle="$group por empleadoAsignadoId + $lookup a empleados para enriquecer con código y área."
          count={porEmpleado.length}
        />
        <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
          <table className="min-w-full divide-y divide-zinc-900 text-[13px]">
            <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Área</th>
                <th className="px-4 py-3 text-right">Asignados</th>
                <th className="px-4 py-3 text-right">En proceso</th>
                <th className="px-4 py-3 text-right">Resueltos</th>
                <th className="px-4 py-3 text-left">Progreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {porEmpleado.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-500">Sin asignaciones registradas.</td></tr>
              )}
              {porEmpleado.map((e, i) => {
                const totalAsig = Number(e.totalAsignados || 0);
                const resueltos = Number(e.resueltos || 0);
                const enProceso = Number(e.enProceso || 0);
                const pctResuelto = totalAsig > 0 ? (resueltos / totalAsig) * 100 : 0;
                return (
                  <tr key={e.codigoEmpleado || i} className="hover:bg-zinc-900/40">
                    <td className="px-4 py-3 font-mono text-[11px] text-zinc-500">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-3 font-mono text-[11.5px] text-brand-300">{e.codigoEmpleado || '—'}</td>
                    <td className="px-4 py-3 text-zinc-100">{`${e.nombre || ''} ${e.apellido || ''}`.trim() || <span className="text-zinc-600">—</span>}</td>
                    <td className="px-4 py-3 capitalize text-zinc-300">{e.area || '—'}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-100">{totalAsig}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-amber-300">{enProceso}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-300">{resueltos}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-900">
                          <div className="h-full bg-emerald-500" style={{ width: `${pctResuelto}%` }} />
                        </div>
                        <span className="font-mono text-[10.5px] tabular-nums text-zinc-500">{pctResuelto.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
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

function SectionHeader({ icon: Icon, title, subtitle, count }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-4">
      <div className="flex items-start gap-2.5">
        {Icon && (
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
            <Icon size={13} className="text-brand-400" />
          </div>
        )}
        <div>
          <h3 className="text-[14px] font-semibold text-zinc-100">{title}</h3>
          <p className="mt-0.5 text-[11.5px] text-zinc-500">{subtitle}</p>
        </div>
      </div>
      {typeof count === 'number' && (
        <span className="font-mono text-[11px] text-zinc-500">{count} filas</span>
      )}
    </div>
  );
}

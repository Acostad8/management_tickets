import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket, CheckCircle2, Clock, BookOpen, Plus, ArrowRight,
  Timer, GraduationCap, ShieldCheck,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { StatCard } from './dashboard/StatCard';
import { BreakdownBars } from './dashboard/BreakdownBars';
import { TicketsPorDiaChart } from './dashboard/TicketsPorDiaChart';
import { TicketsRecientes } from './dashboard/TicketsRecientes';
import { PeriodSelector, periodRange } from './dashboard/PeriodSelector';
import { TopTecnicosWidget } from './dashboard/TopTecnicosWidget';
import { MembresiasWidget } from './dashboard/MembresiasWidget';
import { CapacitacionesProximas } from './dashboard/CapacitacionesProximas';
import { DashboardSkeleton } from './dashboard/DashboardSkeleton';

const PRIORIDAD_COLORS = {
  baja:    'bg-zinc-500',
  media:   'bg-sky-500',
  alta:    'bg-orange-500',
  critica: 'bg-red-500',
};

const MODULO_COLORS = {
  ventas_online: 'bg-indigo-500',
  inventarios:   'bg-emerald-500',
  compras:       'bg-amber-500',
  produccion:    'bg-rose-500',
  ventas_sitio:  'bg-cyan-500',
};

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasRole = useAuthStore((s) => s.hasRole);

  const canReadReports = hasPermission('reportes.leer');
  const isCliente = hasRole('CLIENTE');

  if (!canReadReports) {
    return <PersonalDashboard user={user} isCliente={isCliente} hasPermission={hasPermission} />;
  }
  return <AdminDashboard user={user} hasPermission={hasPermission} />;
}

function AdminDashboard({ user, hasPermission }) {
  const [period, setPeriod] = useState('30d');
  const [summary, setSummary] = useState(null);
  const [porDia, setPorDia] = useState([]);
  const [recientes, setRecientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const { desde, hasta } = periodRange(period);
    const q = desde ? { desde, hasta } : {};
    Promise.all([
      api.get('/dashboard/resumen', { params: q }).then((r) => r.data),
      api.get('/dashboard/tickets-por-dia', { params: q }).then((r) => r.data).catch(() => []),
      api.get('/tickets', { params: { size: 6, sort: 'fechaCreacion,desc' } }).then((r) => r.data).catch(() => ({ content: [] })),
      api.get('/reportes/tickets-por-empleado', { params: { limit: 5 } }).then((r) => r.data).catch(() => []),
      api.get('/capacitaciones', { params: { estado: 'programada', size: 4, sort: 'fechaProgramada,asc' } })
        .then((r) => r.data).catch(() => ({ content: [] })),
    ])
      .then(([s, d, t, emp, cap]) => {
        setSummary(s);
        const nDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : (d || []).length;
        setPorDia((d || []).slice(-nDays));
        setRecientes(t.content || []);
        setTecnicos(emp || []);
        setCapacitaciones(cap.content || []);
      })
      .catch((e) => setError(e.response?.data?.message || 'Error cargando dashboard'))
      .finally(() => setLoading(false));
  }, [period]);

  if (error) {
    return (
      <div className="rounded-md border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }
  if (loading && !summary) return <DashboardSkeleton />;
  if (!summary) return null;

  const slaHoras = summary.promedioHorasResolucion;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-5 border-b border-zinc-900 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-zinc-50">
            {greet()}, {user?.nombre || 'equipo'}.
          </h1>
          <p className="mt-2 text-[14px] text-zinc-400">
            Un vistazo rápido al estado del panel de soporte.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PeriodSelector value={period} onChange={setPeriod} />
          {hasPermission('tickets.crear') && (
            <Link to="/tickets/nuevo" className="btn-primary">
              <Plus size={14} /> Nuevo ticket
            </Link>
          )}
          <Link to="/tickets" className="btn-secondary">
            Ver tickets <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-px bg-zinc-900 lg:grid-cols-4">
        <StatCard
          label="Abiertos"
          value={summary.ticketsAbiertos}
          icon={Clock}
          accent="text-amber-400"
          hint={`${summary.ticketsNuevos} nuevos · ${summary.ticketsEnProceso} en proceso`}
        />
        <StatCard
          label="Resueltos"
          value={summary.ticketsResueltos}
          icon={CheckCircle2}
          accent="text-emerald-400"
          hint={`${summary.ticketsCerrados} cerrados`}
        />
        <StatCard
          label="SLA promedio"
          value={slaHoras != null ? `${slaHoras.toFixed(1)}h` : '—'}
          icon={Timer}
          accent="text-sky-400"
          hint="tiempo medio de resolución"
        />
        <StatCard
          label="Total tickets"
          value={summary.totalTickets}
          icon={Ticket}
          accent="text-brand-400"
          hint={`${summary.totalClientes} clientes · ${summary.totalUsuarios} usuarios`}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TicketsPorDiaChart data={porDia} />
        </div>
        <BreakdownBars
          title="Por prioridad"
          rows={summary.ticketsPorPrioridad}
          colors={PRIORIDAD_COLORS}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <BreakdownBars
          title="Por módulo del ERP"
          rows={summary.ticketsPorModulo}
          colors={MODULO_COLORS}
        />
        <TopTecnicosWidget data={tecnicos} />
        <div className="space-y-6">
          <MembresiasWidget
            activas={summary.membresiasActivas}
            porVencer={summary.membresiasPorVencer}
          />
          <StatCard
            label="Capacitaciones próximas"
            value={summary.capacitacionesProximas}
            icon={GraduationCap}
            accent="text-indigo-400"
            hint="próximos 30 días"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <CapacitacionesProximas items={capacitaciones} />
        <TicketsRecientes tickets={recientes} />
      </section>

      <section className="flex items-center justify-between border-t border-zinc-900 pt-6 text-[11px] text-zinc-600">
        <span className="font-mono">base de conocimiento · {summary.totalArticulosKb} artículos</span>
        <Link to="/base-conocimiento" className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-100">
          <BookOpen size={12} /> Explorar
        </Link>
      </section>
    </div>
  );
}

function PersonalDashboard({ user, isCliente, hasPermission }) {
  const [tickets, setTickets] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canReadCapacitaciones = hasPermission('capacitaciones.leer');
  const canCreateTicket = hasPermission('tickets.crear');

  useEffect(() => {
    setLoading(true);
    const calls = [
      api.get('/tickets', { params: { size: 50, sort: 'fechaCreacion,desc' } }).then((r) => r.data).catch(() => ({ content: [] })),
    ];
    if (canReadCapacitaciones) {
      calls.push(api.get('/capacitaciones', { params: { estado: 'programada', size: 4, sort: 'fechaProgramada,asc' } })
        .then((r) => r.data).catch(() => ({ content: [] })));
    } else {
      calls.push(Promise.resolve({ content: [] }));
    }
    Promise.all(calls)
      .then(([t, c]) => {
        setTickets(t.content || []);
        setCapacitaciones(c.content || []);
      })
      .catch((e) => setError(e.response?.data?.message || 'Error cargando dashboard'))
      .finally(() => setLoading(false));
  }, [canReadCapacitaciones]);

  if (error) {
    return (
      <div className="rounded-md border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }
  if (loading) return <DashboardSkeleton />;

  const abiertos = tickets.filter((t) => ['nuevo', 'en_proceso', 'en_espera'].includes(t.estado));
  const resueltos = tickets.filter((t) => t.estado === 'resuelto');
  const cerrados = tickets.filter((t) => t.estado === 'cerrado');
  const criticos = abiertos.filter((t) => t.prioridad === 'critica' || t.prioridad === 'alta');

  const subtitle = isCliente
    ? 'Resumen de tus solicitudes y capacitaciones.'
    : 'Tickets accesibles y capacitaciones programadas.';

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-5 border-b border-zinc-900 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-zinc-50">
            {greet()}, {user?.nombre || 'equipo'}.
          </h1>
          <p className="mt-2 text-[14px] text-zinc-400">{subtitle}</p>
        </div>
        {canCreateTicket && (
          <Link to="/tickets/nuevo" className="btn-primary self-start sm:self-end">
            <Plus size={14} /> Nuevo ticket
          </Link>
        )}
      </header>

      <section className="grid grid-cols-2 gap-px bg-zinc-900 lg:grid-cols-4">
        <StatCard label="Abiertos"    value={abiertos.length}  icon={Clock}        accent="text-amber-400"   hint="esperando respuesta" />
        <StatCard label="Prioritarios" value={criticos.length} icon={ShieldCheck}  accent="text-red-400"     hint="alta o crítica" />
        <StatCard label="Resueltos"   value={resueltos.length} icon={CheckCircle2} accent="text-emerald-400" hint="por confirmar" />
        <StatCard label="Cerrados"    value={cerrados.length}  icon={Ticket}       accent="text-zinc-400"    hint="histórico" />
      </section>

      <section className={canReadCapacitaciones ? 'grid gap-6 lg:grid-cols-2' : ''}>
        <TicketsRecientes tickets={tickets.slice(0, 6)} />
        {canReadCapacitaciones && <CapacitacionesProximas items={capacitaciones} />}
      </section>
    </div>
  );
}

function greet() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

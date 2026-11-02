import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket, CheckCircle2, Clock, BookOpen, Plus, Search, ArrowRight,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { StatCard } from './dashboard/StatCard';
import { BreakdownBars } from './dashboard/BreakdownBars';
import { TicketsPorDiaChart } from './dashboard/TicketsPorDiaChart';
import { TicketsRecientes } from './dashboard/TicketsRecientes';

const PRIORIDAD_COLORS = {
  baja:    'bg-slate-400',
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
  const [summary, setSummary] = useState(null);
  const [porDia, setPorDia] = useState([]);
  const [recientes, setRecientes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/resumen').then((r) => r.data),
      api.get('/dashboard/tickets-por-dia').then((r) => r.data).catch(() => []),
      api.get('/tickets?size=6&sort=fechaCreacion,desc').then((r) => r.data).catch(() => ({ content: [] })),
    ])
      .then(([s, d, t]) => {
        setSummary(s);
        setPorDia(d.slice(-14));
        setRecientes(t.content || []);
      })
      .catch((e) => setError(e.response?.data?.message || 'Error cargando dashboard'));
  }, []);

  if (error) {
    return <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>;
  }
  if (!summary) {
    return <div className="animate-pulse text-sm text-slate-500">Cargando resumen…</div>;
  }

  const greeting = greet(user?.nombre);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {greeting}, {user?.nombre || 'equipo'}.
          </h1>
          <p className="mt-1 text-[13.5px] text-slate-500 dark:text-slate-400">
            Esto es lo que pasa en el panel de soporte ahora mismo.
          </p>
        </div>
        <QuickActions hasPermission={hasPermission} />
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Tickets abiertos"
          value={summary.ticketsAbiertos}
          icon={Clock}
          accent="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          hint={`${summary.ticketsNuevos} nuevos · ${summary.ticketsEnProceso} en proceso`}
        />
        <StatCard
          label="Resueltos"
          value={summary.ticketsResueltos}
          icon={CheckCircle2}
          accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          hint={`${summary.ticketsCerrados} cerrados históricamente`}
        />
        <StatCard
          label="Total de tickets"
          value={summary.totalTickets}
          icon={Ticket}
          accent="bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
          hint="Toda la historia del sistema"
        />
        <StatCard
          label="Artículos en base"
          value={summary.totalArticulosKb}
          icon={BookOpen}
          accent="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
          hint={`${summary.totalClientes} clientes · ${summary.totalUsuarios} usuarios`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TicketsPorDiaChart data={porDia} />
        </div>
        <BreakdownBars
          title="Por prioridad"
          rows={summary.ticketsPorPrioridad}
          colors={PRIORIDAD_COLORS}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BreakdownBars
          title="Por módulo del ERP"
          rows={summary.ticketsPorModulo}
          colors={MODULO_COLORS}
        />
        <TicketsRecientes tickets={recientes} />
      </section>
    </div>
  );
}

function greet(nombre) {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function QuickActions({ hasPermission }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasPermission('tickets.crear') && (
        <Link to="/tickets/nuevo" className="btn-primary">
          <Plus size={14} /> Nuevo ticket
        </Link>
      )}
      <Link to="/base-conocimiento" className="btn-secondary">
        <Search size={14} /> Buscar en base
      </Link>
      <Link to="/tickets" className="inline-flex items-center gap-1 text-[13px] text-brand-600 hover:underline dark:text-brand-400">
        Ver tickets <ArrowRight size={12} />
      </Link>
    </div>
  );
}

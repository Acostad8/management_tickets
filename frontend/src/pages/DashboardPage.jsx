import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket, CheckCircle2, Clock, BookOpen, Plus, ArrowRight,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { StatCard } from './dashboard/StatCard';
import { BreakdownBars } from './dashboard/BreakdownBars';
import { TicketsPorDiaChart } from './dashboard/TicketsPorDiaChart';
import { TicketsRecientes } from './dashboard/TicketsRecientes';

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
    return (
      <div className="rounded-md border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }
  if (!summary) {
    return <div className="animate-pulse text-[13px] text-zinc-500">Cargando resumen…</div>;
  }

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
        <div className="flex flex-wrap items-center gap-2">
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
          hint={`${summary.ticketsCerrados} cerrados históricamente`}
        />
        <StatCard
          label="Total de tickets"
          value={summary.totalTickets}
          icon={Ticket}
          accent="text-brand-400"
          hint="Toda la historia del sistema"
        />
        <StatCard
          label="Artículos en base"
          value={summary.totalArticulosKb}
          icon={BookOpen}
          accent="text-indigo-400"
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

      <section className="grid gap-6 lg:grid-cols-2">
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

function greet() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

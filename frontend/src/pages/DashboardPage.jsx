import { useEffect, useState } from 'react';
import { Ticket, CheckCircle2, Clock, BookOpen, Users, Building2 } from 'lucide-react';
import { api } from '../lib/api';

const cards = [
  { key: 'totalTickets',    label: 'Total tickets',    icon: Ticket,       color: 'text-brand-600' },
  { key: 'ticketsAbiertos', label: 'Abiertos',         icon: Clock,        color: 'text-amber-500' },
  { key: 'ticketsResueltos',label: 'Resueltos',        icon: CheckCircle2, color: 'text-emerald-500' },
  { key: 'totalArticulosKb',label: 'Artículos KB',     icon: BookOpen,     color: 'text-indigo-500' },
  { key: 'totalUsuarios',   label: 'Usuarios',         icon: Users,        color: 'text-pink-500' },
  { key: 'totalClientes',   label: 'Clientes',         icon: Building2,    color: 'text-sky-500' },
];

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/dashboard/resumen')
      .then((r) => setSummary(r.data))
      .catch((e) => setError(e.response?.data?.message || 'Error cargando dashboard'));
  }, []);

  if (error) {
    return <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>;
  }
  if (!summary) {
    return <div className="animate-pulse text-sm text-slate-500">Cargando resumen...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Resumen</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
              <Icon className={color} size={18} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary[key]}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">Tickets por módulo</h3>
          <ul className="space-y-2">
            {summary.ticketsPorModulo.map((row) => (
              <li key={row.key} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">{row.key}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">Tickets por prioridad</h3>
          <ul className="space-y-2">
            {summary.ticketsPorPrioridad.map((row) => (
              <li key={row.key} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">{row.key}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

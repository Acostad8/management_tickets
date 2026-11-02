import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, ShieldCheck, BookOpen, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../stores/useAuthStore';
import { LogoMark } from './Logo';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, perm: null },
  { to: '/tickets',   label: 'Tickets',   icon: Ticket, perm: 'tickets.leer' },
  { to: '/usuarios',  label: 'Usuarios',  icon: Users,  perm: 'usuarios.leer' },
  { to: '/roles',     label: 'Roles',     icon: ShieldCheck, perm: 'roles.leer' },
  { to: '/base-conocimiento', label: 'Base Conocimiento', icon: BookOpen, perm: 'base_conocimiento.leer' },
  { to: '/reportes',  label: 'Reportes',  icon: BarChart3, perm: 'reportes.leer' },
];

export function Sidebar({ open, onClose }) {
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} />}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900',
          'md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-4 dark:border-slate-800">
          <LogoMark size={22} className="text-brand-600 dark:text-brand-400" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Sistemas Integrados</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">S.A. · Soporte</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {items.filter(i => !i.perm || hasPermission(i.perm)).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

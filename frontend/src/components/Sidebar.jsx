import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Ticket, Users, ShieldCheck, BookOpen, BarChart3,
  LogOut, X,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../stores/useAuthStore';
import { LogoMark } from './Logo';
import { api } from '../lib/api';

const sections = [
  {
    label: 'Operación',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, perm: null },
      { to: '/tickets',   label: 'Tickets',   icon: Ticket,          perm: 'tickets.leer' },
    ],
  },
  {
    label: 'Conocimiento',
    items: [
      { to: '/base-conocimiento', label: 'Base de conocimiento', icon: BookOpen, perm: 'base_conocimiento.leer' },
      { to: '/reportes',          label: 'Reportes',             icon: BarChart3, perm: 'reportes.leer' },
    ],
  },
  {
    label: 'Administración',
    items: [
      { to: '/usuarios', label: 'Usuarios', icon: Users,       perm: 'usuarios.leer' },
      { to: '/roles',    label: 'Roles',    icon: ShieldCheck, perm: 'roles.leer' },
    ],
  },
];

export function Sidebar({ open, onClose }) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logoutStore();
    navigate('/login', { replace: true });
  };

  const initials = (user?.nombre?.[0] || '?') + (user?.apellido?.[0] || '');

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={onClose} />}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-zinc-900 bg-zinc-950 transition-transform',
          'md:sticky md:top-0 md:h-screen md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-zinc-900 px-5">
          <div className="flex items-center gap-2.5">
            <LogoMark size={20} className="text-brand-500" />
            <span className="text-[13px] font-medium leading-none text-zinc-100">
              Sistemas Integrados <span className="text-zinc-500">S.A.</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden -mr-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            aria-label="Cerrar menú"
          >
            <X size={14} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((section) => {
            const visibleItems = section.items.filter((i) => !i.perm || hasPermission(i.perm));
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.label} className="mb-6 last:mb-0">
                <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                  {section.label}
                </div>
                <ul className="flex flex-col gap-0.5">
                  {visibleItems.map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        onClick={onClose}
                        end={to === '/dashboard'}
                        className={({ isActive }) =>
                          clsx(
                            'group flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition',
                            isActive
                              ? 'bg-zinc-900 text-zinc-50'
                              : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon size={15} className={isActive ? 'text-brand-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
                            <span>{label}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-zinc-900 p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-500/15 font-mono text-[11px] font-medium uppercase text-brand-300">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-zinc-100">
                {user?.nombre} {user?.apellido || ''}
              </div>
              <div className="truncate text-[11px] text-zinc-500">
                {user?.roles?.[0] || '—'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-900 px-2 py-1.5 text-[12px] text-zinc-400 transition hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-200"
          >
            <LogOut size={13} /> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

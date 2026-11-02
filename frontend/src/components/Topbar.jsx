import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { ThemeToggle } from './ThemeToggle';
import { api } from '../lib/api';

export function Topbar({ onToggleSidebar }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-base font-medium text-slate-700 dark:text-slate-200">Panel de Soporte</h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="hidden text-right sm:block">
          <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{user?.nombre} {user?.apellido}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{user?.roles?.join(', ')}</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <LogOut size={14} /> Salir
        </button>
      </div>
    </header>
  );
}

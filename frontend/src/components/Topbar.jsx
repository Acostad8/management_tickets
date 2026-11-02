import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/dashboard':         'Dashboard',
  '/tickets':           'Tickets',
  '/tickets/nuevo':     'Nuevo ticket',
  '/usuarios':          'Usuarios',
  '/roles':             'Roles',
  '/base-conocimiento': 'Base de conocimiento',
  '/base-conocimiento/nuevo': 'Nuevo artículo',
  '/reportes':          'Reportes',
};

export function Topbar({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const title = titles[pathname] || resolveDynamic(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-900 bg-zinc-950/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
          aria-label="Abrir menú"
        >
          <Menu size={15} />
        </button>
        <h1 className="text-[13px] font-medium text-zinc-200">{title}</h1>
      </div>
    </header>
  );
}

function resolveDynamic(pathname) {
  if (pathname.startsWith('/tickets/'))           return 'Detalle de ticket';
  if (pathname.startsWith('/base-conocimiento/')) return 'Artículo';
  return 'Panel';
}

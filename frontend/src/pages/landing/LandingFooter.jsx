import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';

const columnas = [
  {
    titulo: 'Producto',
    links: [
      { label: 'Para quién',    href: '#para-quien' },
      { label: 'Qué incluye',   href: '#incluye' },
      { label: 'Módulos ERP',   href: '#modulos' },
      { label: 'Cómo funciona', href: '#como-funciona' },
    ],
  },
  {
    titulo: 'Recursos',
    links: [
      { label: 'Beneficios', href: '#beneficios' },
      { label: 'FAQ',        href: '#faq' },
    ],
  },
  {
    titulo: 'Equipo',
    links: [
      { label: 'Sistemas Integrados S.A.', href: '#' },
      { label: 'Proyecto de Aula — UFPSO', href: '#' },
    ],
  },
];

export function LandingFooter({ authenticated }) {
  return (
    <footer className="relative border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-20">
        <div className="grid gap-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="brand" size={22} />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-zinc-400">
              Mesa de ayuda centralizada para un ERP/POS modular. Reporta, atiende y documenta
              desde un solo panel.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11.5px] text-zinc-300">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Todos los servicios operativos
            </div>
          </div>

          {columnas.map((col) => (
            <div key={col.titulo}>
              <div className="mb-4 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                {col.titulo}
              </div>
              <ul className="space-y-2.5 text-[13.5px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-zinc-400 transition hover:text-zinc-100"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-zinc-900 pt-6 text-[12px] text-zinc-500 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Sistemas Integrados S.A. · Todos los derechos reservados.</div>
          <div className="flex items-center gap-5">
            <Link
              to={authenticated ? '/dashboard' : '/login'}
              className="transition hover:text-zinc-200"
            >
              {authenticated ? 'Ir al panel' : 'Ingresar'}
            </Link>
            <span className="text-zinc-700">·</span>
            <span className="font-mono text-zinc-600">v1.0 · build 040</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

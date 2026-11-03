import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Logo } from '../../components/Logo';

const links = [
  { href: '#para-quien',    label: 'Para quién' },
  { href: '#incluye',       label: 'Qué incluye' },
  { href: '#modulos',       label: 'Módulos' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#faq',           label: 'FAQ' },
];

export function LandingNav({ authenticated }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={[
        'sticky top-0 z-30 transition-all duration-300',
        scrolled
          ? 'border-b border-zinc-900 bg-zinc-950/85 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.03)]'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo variant="brand" size={22} />

        <div className="hidden items-center gap-7 text-[13px] md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-zinc-400 transition hover:text-zinc-100"
            >
              {l.label}
            </a>
          ))}
          <Link
            to={authenticated ? '/dashboard' : '/login'}
            className="group inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 font-medium text-zinc-100 backdrop-blur transition hover:border-brand-500/50 hover:bg-zinc-900 hover:text-white"
          >
            {authenticated ? 'Ir al panel' : 'Ingresar'}
            <ArrowUpRight
              size={13}
              className="opacity-70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-300 md:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4 text-[14px]">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-zinc-50"
              >
                {l.label}
              </a>
            ))}
            <Link
              to={authenticated ? '/dashboard' : '/login'}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-zinc-50 px-3 py-2 font-medium text-zinc-950"
            >
              {authenticated ? 'Ir al panel' : 'Ingresar'}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

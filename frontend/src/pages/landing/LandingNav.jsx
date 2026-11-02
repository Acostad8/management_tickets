import { Link } from 'react-router-dom';

export function LandingNav({ authenticated }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-5 rounded-sm bg-brand-500" aria-hidden />
          <span className="text-[13px] font-medium tracking-tight text-zinc-100">
            Sistemas Integrados <span className="text-zinc-500">S.A.</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-[13px]">
          <a href="#para-quien"    className="text-zinc-400 transition hover:text-zinc-100">Para quién</a>
          <a href="#incluye"       className="text-zinc-400 transition hover:text-zinc-100">Qué incluye</a>
          <a href="#como-funciona" className="text-zinc-400 transition hover:text-zinc-100">Cómo funciona</a>
          <Link
            to={authenticated ? '/dashboard' : '/login'}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-medium text-zinc-100 transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            {authenticated ? 'Ir al panel' : 'Ingresar'}
          </Link>
        </div>
      </div>
    </nav>
  );
}

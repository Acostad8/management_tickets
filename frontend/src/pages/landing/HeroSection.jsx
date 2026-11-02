import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export function HeroSection({ authenticated }) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-900">
      <GridBackdrop />
      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-24 sm:pt-32">
        <h1 className="max-w-4xl text-[46px] font-semibold leading-[1.02] tracking-tightest text-zinc-50 sm:text-[72px]">
          Soporte técnico centralizado,{' '}
          <span className="relative inline-block text-zinc-50">
            del reporte a la solución
            <span className="absolute bottom-1 left-0 right-0 h-[6px] bg-brand-500/30" aria-hidden />
          </span>
          .
        </h1>

        <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-zinc-400">
          Una plataforma única para que tus clientes reporten incidentes y tu equipo de
          soporte los atienda con toda la información que necesita en un solo lugar.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to={authenticated ? '/dashboard' : '/login'}
            className="group inline-flex h-11 items-center gap-2 rounded-md bg-zinc-50 px-5 text-[14px] font-medium text-zinc-950 transition hover:bg-white"
          >
            {authenticated ? 'Abrir panel de soporte' : 'Ingresar al sistema'}
            <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#como-funciona"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/40 px-5 text-[14px] font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
          >
            Ver cómo funciona
          </a>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-zinc-900 pt-10 sm:grid-cols-4">
          <Stat value="5" label="Módulos ERP cubiertos" />
          <Stat value="24/7" label="Portal siempre disponible" />
          <Stat value="100%" label="Historial de cada caso" />
          <Stat value="1" label="Panel para todo el equipo" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-3xl font-semibold tracking-tight text-zinc-100">{value}</div>
      <div className="mt-1 text-[12px] uppercase tracking-wider text-zinc-500">{label}</div>
    </div>
  );
}

function GridBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage:
          'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 60% 50% at 50% 20%, black 40%, transparent 100%)',
      }}
      aria-hidden
    />
  );
}

import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export function CtaSection({ authenticated }) {
  return (
    <section className="relative border-b border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950 px-8 py-16 sm:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px] animate-aurora"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)',
            }}
          />

          <div className="relative flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-[12px] text-zinc-300 backdrop-blur">
                <Sparkles size={12} className="text-brand-400" />
                Un panel. Todo el soporte.
              </div>
              <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-50 sm:text-5xl">
                Abre el sistema y atiende tu primera solicitud en minutos.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-zinc-400">
                Acceso inmediato con tu cuenta. Sin trámites, sin instalación.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <Link
                to={authenticated ? '/dashboard' : '/login'}
                className="group inline-flex h-12 items-center gap-2 rounded-md bg-zinc-50 px-6 text-[14.5px] font-medium text-zinc-950 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_12px_32px_-10px_rgba(45,143,255,0.55)] transition hover:bg-white"
              >
                {authenticated ? 'Abrir panel de soporte' : 'Ingresar al sistema'}
                <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#incluye"
                className="inline-flex items-center gap-1 text-[13px] text-zinc-400 transition hover:text-zinc-200"
              >
                O revisa qué incluye primero
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

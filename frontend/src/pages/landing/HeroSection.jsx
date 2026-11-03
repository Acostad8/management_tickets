import { Link } from 'react-router-dom';
import {
  ArrowUpRight, Sparkles, Inbox, Clock, CheckCircle2,
  AlertCircle, ChevronRight,
} from 'lucide-react';

export function HeroSection({ authenticated }) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-900">
      <AuroraBackdrop />
      <GridBackdrop />

      <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-8 sm:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-3 py-1 text-[12px] text-zinc-300 backdrop-blur">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Mesa de ayuda operativa 24/7
              <span className="text-zinc-600">·</span>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Sparkles size={11} className="text-brand-400" />
                v1.0
              </span>
            </div>

            <h1 className="max-w-2xl text-balance text-[38px] font-semibold leading-[1.02] tracking-tightest sm:text-[56px]">
              <span className="gradient-text">Soporte técnico centralizado,</span>{' '}
              <span className="relative inline-block text-zinc-50">
                del reporte a la solución
                <span className="absolute -bottom-0.5 left-0 right-0 h-[6px] bg-gradient-to-r from-brand-500/0 via-brand-500/40 to-brand-500/0" aria-hidden />
              </span>
              <span className="text-brand-400">.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-zinc-400">
              Una plataforma única donde tus clientes reportan incidentes y tu equipo los atiende
              con todo el contexto en un solo lugar — sin correos perdidos, sin preguntar lo mismo
              tres veces.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={authenticated ? '/dashboard' : '/login'}
                className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-md bg-zinc-50 px-5 text-[14px] font-medium text-zinc-950 shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_8px_24px_-8px_rgba(45,143,255,0.5)] transition hover:bg-white"
              >
                <span className="relative z-10">
                  {authenticated ? 'Abrir panel de soporte' : 'Ingresar al sistema'}
                </span>
                <ArrowUpRight size={16} className="relative z-10 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 px-5 text-[14px] font-medium text-zinc-300 backdrop-blur transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-50"
              >
                Ver cómo funciona
                <ChevronRight size={14} className="text-zinc-500" />
              </a>
            </div>

            <TrustRow />
          </div>

          <TicketMockup />
        </div>

        <dl className="relative mt-12 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-zinc-900 pt-7 sm:grid-cols-4">
          <Stat value="5"    label="Módulos ERP cubiertos" />
          <Stat value="24/7" label="Portal siempre disponible" />
          <Stat value="100%" label="Historial de cada caso" />
          <Stat value="1"    label="Panel para todo el equipo" />
        </dl>
      </div>
    </section>
  );
}

function TrustRow() {
  const items = [
    'Historial completo por caso',
    'Base de conocimiento integrada',
    'Notificaciones automáticas',
  ];
  return (
    <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-zinc-500">
      {items.map((t) => (
        <li key={t} className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-brand-400/80" />
          {t}
        </li>
      ))}
    </ul>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="bg-gradient-to-br from-zinc-50 to-zinc-400 bg-clip-text text-[32px] font-semibold tracking-tight text-transparent">
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-zinc-500">{label}</div>
    </div>
  );
}

function TicketMockup() {
  return (
    <div className="relative hidden lg:block">
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-brand-500/10 blur-3xl"
        aria-hidden
      />
      <div className="animate-float">
        <div className="relative rounded-xl border border-zinc-800/80 bg-zinc-950/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            </div>
            <div className="ml-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Inbox size={12} /> Bandeja · Soporte
            </div>
            <span className="ml-auto rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
              12 abiertos
            </span>
          </div>

          <div className="divide-y divide-zinc-900">
            <TicketRow
              code="TCK-0427"
              title="Error 500 en checkout — pasarela Wompi"
              mod="ventas_online"
              estado="Abierto"
              prio="Alta"
              prioClass="text-rose-400 bg-rose-500/10 border-rose-500/30"
              icon={<AlertCircle size={11} className="text-rose-400" />}
            />
            <TicketRow
              code="TCK-0426"
              title="Discrepancia inventario bodega Norte"
              mod="inventarios"
              estado="En progreso"
              prio="Media"
              prioClass="text-amber-300 bg-amber-500/10 border-amber-500/30"
              icon={<Clock size={11} className="text-amber-300" />}
              highlight
            />
            <TicketRow
              code="TCK-0425"
              title="Lote 882 fuera de temperatura"
              mod="produccion"
              estado="Resuelto"
              prio="Baja"
              prioClass="text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
              icon={<CheckCircle2 size={11} className="text-emerald-300" />}
            />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-900 px-4 py-2.5 text-[11px] text-zinc-500">
            <span>SLA promedio</span>
            <span className="font-mono text-zinc-300">02h 14m</span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-10 -bottom-6 h-6 rounded-full bg-black/40 blur-xl"
        aria-hidden
      />
    </div>
  );
}

function TicketRow({ code, title, mod, estado, prio, prioClass, icon, highlight }) {
  return (
    <div className={[
      'grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 transition',
      highlight ? 'bg-brand-500/[0.04]' : '',
    ].join(' ')}>
      <span className="font-mono text-[10.5px] text-zinc-500">{code}</span>
      <div className="min-w-0">
        <div className="truncate text-[12.5px] text-zinc-100">{title}</div>
        <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span className="text-brand-400/80">#{mod}</span>
          <span>·</span>
          <span>{estado}</span>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${prioClass}`}>
        {icon}
        {prio}
      </span>
    </div>
  );
}

function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px] animate-aurora" />
      <div className="absolute -top-20 right-[-10%] h-[420px] w-[520px] rounded-full bg-indigo-500/15 blur-[120px] animate-aurora-slow" />
      <div className="absolute top-32 left-[-10%] h-[360px] w-[460px] rounded-full bg-cyan-500/10 blur-[120px] animate-aurora-slow" />
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
        maskImage: 'radial-gradient(ellipse 70% 55% at 50% 15%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 15%, black 40%, transparent 100%)',
      }}
      aria-hidden
    />
  );
}

import { Headphones, Building2, CheckCircle2 } from 'lucide-react';

const audiencias = [
  {
    icon: Headphones,
    titulo: 'Equipos de soporte',
    descripcion:
      'Ingenieros, supervisores y administradores que reciben los casos. Cada ticket llega con el contexto específico del módulo afectado: el equipo deja de perseguir datos y empieza a resolver.',
    bullets: [
      'Bandeja compartida con filtros por estado, prioridad y módulo.',
      'Historial completo de cada caso: respuestas, cambios, solución.',
      'Base de conocimiento para no responder lo mismo dos veces.',
    ],
    accent: 'from-brand-500/20 via-brand-500/5 to-transparent',
  },
  {
    icon: Building2,
    titulo: 'Empresas cliente',
    descripcion:
      'Compañías que operan el ERP/POS día a día. Reportan incidentes desde su propio portal, siguen el avance en tiempo real y consultan soluciones ya documentadas sin esperar a nadie.',
    bullets: [
      'Portal con sesión propia para abrir y consultar tickets.',
      'Seguimiento del estado del caso desde que entra hasta que cierra.',
      'Autoservicio: la mayoría de dudas ya tienen respuesta documentada.',
    ],
    accent: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
  },
];

export function AudienciasSection() {
  return (
    <section id="para-quien" className="relative border-b border-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <SectionHeader
          eyebrow="Para quién"
          title="Pensado para los dos lados de la misma mesa."
          lead="Un sistema que acompaña al equipo que atiende y a las empresas que confían en el servicio."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {audiencias.map(({ icon: Icon, titulo, descripcion, bullets, accent }) => (
            <article
              key={titulo}
              className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950 p-8 transition hover:border-zinc-800"
            >
              <div
                className={`pointer-events-none absolute -top-24 right-[-20%] h-64 w-64 rounded-full bg-gradient-to-br ${accent} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
                aria-hidden
              />
              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-brand-400 shadow-inner">
                  <Icon size={20} />
                </div>
                <h3 className="mt-6 text-[22px] font-medium text-zinc-100">{titulo}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{descripcion}</p>
                <ul className="mt-7 space-y-3 text-[14px] text-zinc-300">
                  {bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <CheckCircle2 size={16} className="mt-[2px] flex-shrink-0 text-brand-400/80" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, lead }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-brand-300">
          <span className="h-1 w-1 rounded-full bg-brand-400" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
        {title}
      </h2>
      {lead && (
        <p className="mt-5 text-[16px] leading-relaxed text-zinc-400">{lead}</p>
      )}
    </div>
  );
}

import { Zap, Users2, History, BarChart3 } from 'lucide-react';
import { SectionHeader } from './AudienciasSection';

const beneficios = [
  {
    icon: Zap,
    numero: '01',
    titulo: 'Menos tiempo buscando contexto',
    descripcion:
      'Cada ticket llega con la información específica del módulo. El equipo no tiene que pedirle al cliente los mismos datos tres veces.',
  },
  {
    icon: Users2,
    numero: '02',
    titulo: 'Clientes que se autoatienden',
    descripcion:
      'La base de conocimiento resuelve las preguntas repetidas antes de que generen un ticket. El equipo se enfoca en los casos reales.',
  },
  {
    icon: History,
    numero: '03',
    titulo: 'Trazabilidad completa',
    descripcion:
      'Todo queda registrado: quién reportó, quién atendió, qué se hizo y cuándo. Útil para auditoría y para aprender como organización.',
  },
  {
    icon: BarChart3,
    numero: '04',
    titulo: 'Visibilidad para el negocio',
    descripcion:
      'Reportes para entender dónde fallan los módulos, qué clientes consumen más soporte y dónde conviene invertir en formación o producto.',
  },
];

export function BeneficiosSection() {
  return (
    <section id="beneficios" className="relative border-b border-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <SectionHeader
          eyebrow="Beneficios"
          title="Lo que cambia cuando el soporte está en un solo lugar."
        />

        <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {beneficios.map(({ icon: Icon, numero, titulo, descripcion }) => (
            <article key={titulo} className="group relative">
              <div className="flex items-start justify-between">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-brand-400 transition group-hover:border-brand-500/40">
                  <Icon size={19} />
                </div>
                <span className="bg-gradient-to-br from-zinc-700 to-zinc-900 bg-clip-text text-5xl font-semibold tracking-tightest text-transparent">
                  {numero}
                </span>
              </div>
              <h3 className="mt-6 text-[22px] font-medium text-zinc-100">{titulo}</h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-400">
                {descripcion}
              </p>
              <div className="mt-6 h-px w-16 bg-gradient-to-r from-brand-500/60 to-transparent" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

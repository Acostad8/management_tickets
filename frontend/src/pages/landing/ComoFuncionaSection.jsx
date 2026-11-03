import { FilePlus2, Users, BookCheck, MailCheck } from 'lucide-react';
import { SectionHeader } from './AudienciasSection';

const pasos = [
  {
    numero: '01',
    icon: FilePlus2,
    titulo: 'El cliente reporta',
    descripcion:
      'Desde su propio portal, la empresa cliente abre un ticket indicando el módulo afectado y los detalles del caso. El sistema le asigna un código único de seguimiento.',
  },
  {
    numero: '02',
    icon: Users,
    titulo: 'Soporte toma el caso',
    descripcion:
      'El equipo recibe el ticket con todo el contexto, lo clasifica por prioridad y lo asigna a la persona indicada. Nada se pierde en correos ni chats dispersos.',
  },
  {
    numero: '03',
    icon: BookCheck,
    titulo: 'Se resuelve y se documenta',
    descripcion:
      'La solución queda registrada dentro del ticket y, cuando aporta valor, pasa a la base de conocimiento. La próxima vez que ese problema aparezca, la respuesta ya existe.',
  },
  {
    numero: '04',
    icon: MailCheck,
    titulo: 'El cliente queda informado',
    descripcion:
      'Cada cambio importante notifica al cliente por correo. Puede consultar el estado del caso cuando quiera, sin llamadas de seguimiento.',
  },
];

export function ComoFuncionaSection() {
  return (
    <section id="como-funciona" className="relative border-b border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <SectionHeader
          eyebrow="Flujo"
          title="Un flujo que todos entienden."
          lead="Desde que el cliente reporta hasta que el caso cierra, cada paso queda registrado y visible para quien corresponde."
        />

        <ol className="relative mt-16">
          <div
            className="pointer-events-none absolute left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-zinc-800 via-zinc-800 to-transparent sm:left-[31px]"
            aria-hidden
          />
          {pasos.map(({ numero, icon: Icon, titulo, descripcion }, i) => (
            <li
              key={numero}
              className="relative grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 pb-10 last:pb-0"
            >
              <div className="relative">
                <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-brand-400 shadow-[0_0_0_4px_rgba(9,9,11,1)]">
                  <Icon size={20} />
                </div>
              </div>

              <div className="min-w-0 pt-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-brand-300/80">
                    Paso {numero}
                  </span>
                  {i < pasos.length - 1 && (
                    <span className="h-px flex-1 bg-zinc-900" aria-hidden />
                  )}
                </div>
                <h3 className="mt-2 text-[22px] font-medium text-zinc-100">{titulo}</h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
                  {descripcion}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

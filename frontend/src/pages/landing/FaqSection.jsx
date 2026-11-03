import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SectionHeader } from './AudienciasSection';

const faqs = [
  {
    q: '¿Necesito instalar algo para usarlo?',
    a: 'No. El sistema es web: tus clientes y tu equipo acceden desde el navegador con sesión propia. Nada que instalar ni mantener en los equipos.',
  },
  {
    q: '¿Qué módulos del ERP cubre?',
    a: 'Ventas Online, Inventarios, Compras, Producción y Caja/POS. Cada módulo tiene su propio formulario con los campos técnicos que ese tipo de incidente requiere.',
  },
  {
    q: '¿Los clientes ven los tickets de otros clientes?',
    a: 'Nunca. Cada empresa cliente solo ve sus propios tickets. Los roles del equipo de soporte sí tienen visibilidad completa de la bandeja.',
  },
  {
    q: '¿Cómo se enteran los clientes del avance?',
    a: 'Por correo automático en cada cambio de estado o respuesta, y también entrando a su portal cuando quieran. No hay que llamar a preguntar.',
  },
  {
    q: '¿Puedo exportar reportes para auditoría?',
    a: 'Sí. El panel de reportes incluye volumen, prioridades, módulos y rendimiento por empleado, con filtros por rango de fechas.',
  },
  {
    q: '¿Qué pasa con las contraseñas y el acceso?',
    a: 'Hashing seguro, recuperación por correo y bloqueo automático ante intentos sospechosos. Los permisos se gestionan por rol desde el panel de administración.',
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative border-b border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <SectionHeader
          eyebrow="Preguntas frecuentes"
          title="Dudas que suelen aparecer antes de ingresar."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <aside className="hidden lg:block">
            <p className="text-[15px] leading-relaxed text-zinc-400">
              Si tu pregunta no está acá, lo más rápido es abrir el sistema y revisar la base de
              conocimiento interna o escribir a tu administrador.
            </p>
            <div className="mt-6 rounded-lg border border-zinc-900 bg-zinc-950 p-5">
              <div className="text-[12px] uppercase tracking-wider text-zinc-500">Soporte interno</div>
              <div className="mt-2 font-mono text-[13px] text-zinc-300">soporte@sistemas-integrados.co</div>
            </div>
          </aside>

          <div className="divide-y divide-zinc-900 rounded-xl border border-zinc-900 bg-zinc-950">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left transition hover:bg-zinc-900/40"
                  >
                    <span className="text-[15.5px] font-medium text-zinc-100">{f.q}</span>
                    <Plus
                      size={18}
                      className={[
                        'mt-1 flex-shrink-0 text-zinc-500 transition-transform duration-300',
                        isOpen ? 'rotate-45 text-brand-400' : '',
                      ].join(' ')}
                    />
                  </button>
                  <div
                    className={[
                      'grid overflow-hidden px-6 transition-all duration-300',
                      isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]',
                    ].join(' ')}
                  >
                    <div className="min-h-0 text-[14.5px] leading-relaxed text-zinc-400">
                      {f.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  Inbox, BookOpen, LineChart, UserCog, Bell, ShieldCheck,
} from 'lucide-react';
import { SectionHeader } from './AudienciasSection';

const items = [
  {
    icon: Inbox,
    titulo: 'Gestión de tickets',
    descripcion:
      'Captura cada reporte con la información específica del módulo afectado. Asignación, estados, respuestas públicas e internas y cierre documentado.',
  },
  {
    icon: BookOpen,
    titulo: 'Base de conocimiento',
    descripcion:
      'Repositorio de soluciones consultable por texto libre. El equipo documenta una vez; los clientes y futuros tickets lo encuentran al instante.',
  },
  {
    icon: LineChart,
    titulo: 'Reportes y seguimiento',
    descripcion:
      'Panel con estado del volumen de casos, prioridades, módulos más consultados y rendimiento por empleado. Decisiones con datos reales.',
  },
  {
    icon: UserCog,
    titulo: 'Usuarios y roles',
    descripcion:
      'Control de accesos por perfil: administradores, soporte, ventas y clientes. Cada quien ve lo que debe ver, nada más.',
  },
  {
    icon: Bell,
    titulo: 'Notificaciones por correo',
    descripcion:
      'Avisos automáticos al cliente cuando su ticket cambia de estado o recibe una respuesta, sin tener que llamar a preguntar.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Acceso seguro',
    descripcion:
      'Inicio de sesión con contraseña protegida, recuperación por correo y bloqueo automático ante intentos sospechosos.',
  },
];

export function IncluyeSection() {
  return (
    <section id="incluye" className="relative border-b border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <SectionHeader
          eyebrow="Qué incluye"
          title="Todo lo que necesita una mesa de ayuda, en el mismo panel."
          lead="Seis capacidades esenciales que trabajan juntas desde el primer día — sin plug-ins, sin ensamblajes."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, titulo, descripcion }, i) => (
            <article
              key={titulo}
              className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-gradient-to-b from-zinc-950 to-zinc-950 p-7 transition hover:border-zinc-800 hover:from-zinc-900/40"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
                style={{
                  background:
                    'radial-gradient(400px circle at 50% 0%, rgba(45,143,255,0.08), transparent 60%)',
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-brand-400 transition group-hover:border-brand-500/40 group-hover:text-brand-300">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-[11px] text-zinc-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-[17px] font-medium text-zinc-100">{titulo}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">{descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

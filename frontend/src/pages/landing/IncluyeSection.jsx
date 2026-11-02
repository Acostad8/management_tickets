import {
  Inbox, BookOpen, LineChart, UserCog, Bell, ShieldCheck,
} from 'lucide-react';

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
    <section id="incluye" className="border-b border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Todo lo que necesita una mesa de ayuda, en el mismo panel.
          </h2>
        </div>

        <div className="grid gap-px border-y border-zinc-900 bg-zinc-900 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, titulo, descripcion }) => (
            <div key={titulo} className="bg-zinc-950 p-8">
              <Icon className="text-brand-400" size={20} />
              <h3 className="mt-5 text-[17px] font-medium text-zinc-100">{titulo}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">{descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

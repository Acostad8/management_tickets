import { Headphones, Building2 } from 'lucide-react';

export function AudienciasSection() {
  return (
    <section id="para-quien" className="border-b border-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Pensado para dos lados de la misma mesa.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-zinc-400">
            Un sistema que acompaña al equipo que atiende y a las empresas que confían en el servicio.
          </p>
        </div>

        <div className="grid gap-px border-y border-zinc-900 bg-zinc-900 md:grid-cols-2">
          <div className="bg-zinc-950 p-10">
            <Headphones className="text-brand-400" size={22} />
            <h3 className="mt-5 text-[22px] font-medium text-zinc-100">Equipos de soporte</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
              Ingenieros, supervisores y administradores que reciben los casos. Cada ticket llega con
              el contexto específico del módulo afectado: el equipo deja de perseguir datos y empieza
              a resolver.
            </p>
            <ul className="mt-6 space-y-2.5 text-[14px] text-zinc-300">
              <Bullet>Bandeja compartida con filtros por estado, prioridad y módulo.</Bullet>
              <Bullet>Historial completo de cada caso: respuestas, cambios, solución.</Bullet>
              <Bullet>Base de conocimiento para no responder lo mismo dos veces.</Bullet>
            </ul>
          </div>

          <div className="bg-zinc-950 p-10">
            <Building2 className="text-brand-400" size={22} />
            <h3 className="mt-5 text-[22px] font-medium text-zinc-100">Empresas cliente</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
              Compañías que operan el ERP/POS día a día. Reportan incidentes desde su propio portal,
              siguen el avance en tiempo real y consultan soluciones ya documentadas sin esperar a
              nadie.
            </p>
            <ul className="mt-6 space-y-2.5 text-[14px] text-zinc-300">
              <Bullet>Portal con sesión propia para abrir y consultar tickets.</Bullet>
              <Bullet>Seguimiento del estado del caso desde que entra hasta que cierra.</Bullet>
              <Bullet>Autoservicio: la mayoría de dudas ya tienen respuesta documentada.</Bullet>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ children }) {
  return (
    <li className="flex gap-3">
      <span className="mt-[7px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
      <span>{children}</span>
    </li>
  );
}

const beneficios = [
  {
    titulo: 'Menos tiempo buscando contexto',
    descripcion:
      'Cada ticket llega con la información específica del módulo. El equipo no tiene que pedirle al cliente los mismos datos tres veces.',
  },
  {
    titulo: 'Clientes que se autoatienden',
    descripcion:
      'La base de conocimiento resuelve las preguntas repetidas antes de que generen un ticket. El equipo se enfoca en los casos reales.',
  },
  {
    titulo: 'Trazabilidad completa',
    descripcion:
      'Todo queda registrado: quién reportó, quién atendió, qué se hizo y cuándo. Útil para auditoría y para aprender como organización.',
  },
  {
    titulo: 'Visibilidad para el negocio',
    descripcion:
      'Reportes para entender dónde fallan los módulos, qué clientes consumen más soporte y dónde conviene invertir en formación o producto.',
  },
];

export function BeneficiosSection() {
  return (
    <section id="beneficios" className="border-b border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Lo que cambia cuando el soporte está en un solo lugar.
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {beneficios.map((b) => (
            <article key={b.titulo} className="border-l border-zinc-800 pl-6">
              <h3 className="text-[20px] font-medium text-zinc-100">{b.titulo}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{b.descripcion}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const pasos = [
  {
    numero: '1',
    titulo: 'El cliente reporta',
    descripcion:
      'Desde su propio portal, la empresa cliente abre un ticket indicando el módulo afectado y los detalles del caso. El sistema le asigna un código único de seguimiento.',
  },
  {
    numero: '2',
    titulo: 'Soporte toma el caso',
    descripcion:
      'El equipo recibe el ticket con todo el contexto, lo clasifica por prioridad y lo asigna a la persona indicada. Nada se pierde en correos ni chats dispersos.',
  },
  {
    numero: '3',
    titulo: 'Se resuelve y se documenta',
    descripcion:
      'La solución queda registrada dentro del ticket y, cuando aporta valor, pasa a la base de conocimiento. La próxima vez que ese problema aparezca, la respuesta ya existe.',
  },
  {
    numero: '4',
    titulo: 'El cliente queda informado',
    descripcion:
      'Cada cambio importante notifica al cliente por correo. Puede consultar el estado del caso cuando quiera, sin llamadas de seguimiento.',
  },
];

export function ComoFuncionaSection() {
  return (
    <section id="como-funciona" className="border-b border-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Un flujo que todos entienden.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-zinc-400">
            Desde que el cliente reporta hasta que el caso cierra, cada paso queda registrado y
            visible para quien corresponde.
          </p>
        </div>

        <ol className="divide-y divide-zinc-900 border-y border-zinc-900">
          {pasos.map((p) => (
            <li key={p.numero} className="grid grid-cols-12 gap-6 py-8">
              <div className="col-span-12 sm:col-span-2">
                <span className="text-5xl font-semibold tracking-tightest text-zinc-800 tabular-nums">
                  {p.numero}
                </span>
              </div>
              <div className="col-span-12 sm:col-span-5">
                <h3 className="text-[22px] font-medium text-zinc-100">{p.titulo}</h3>
              </div>
              <p className="col-span-12 text-[15px] leading-relaxed text-zinc-400 sm:col-span-5">
                {p.descripcion}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

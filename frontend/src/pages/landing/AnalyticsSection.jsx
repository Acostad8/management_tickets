const snippets = [
  {
    operator: '$group',
    titulo: 'Tickets por módulo',
    descripcion: 'Agrupación directa sobre la colección. Sin ETL ni warehouse.',
    code: `db.tickets.aggregate([
  { $match: { fechaCreacion: { $gte: desde } } },
  { $group: {
      _id: "$modulo",
      count: { $sum: 1 }
  }},
  { $sort: { count: -1 } }
])`,
    result: [
      ['ventas_online', 4],
      ['inventarios',   3],
      ['produccion',    1],
      ['ventas_sitio',  1],
      ['compras',       1],
    ],
  },
  {
    operator: '$lookup',
    titulo: 'Tickets por cliente, con razón social',
    descripcion: 'Join contra la colección clientes dentro del mismo pipeline.',
    code: `db.tickets.aggregate([
  { $group: {
      _id: "$clienteId",
      totalTickets: { $sum: 1 }
  }},
  { $lookup: {
      from: "clientes",
      localField: "_id",
      foreignField: "_id",
      as: "cliente"
  }},
  { $unwind: "$cliente" },
  { $project: {
      razonSocial: "$cliente.razonSocial",
      totalTickets: 1
  }}
])`,
    result: [
      ['Distribuciones Catatumbo S.A.S.',   2],
      ['Comercializadora Norte S.A.S.',      2],
      ['Soluciones Empresariales S.A.S.',    2],
      ['Inversiones Santander S.A.S.',       1],
    ],
  },
];

export function AnalyticsSection() {
  return (
    <section id="analytics" className="border-b border-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-3xl">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            La analítica vive dentro de la base de datos.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-zinc-400">
            El Aggregation Framework de MongoDB entrega los reportes directamente desde las colecciones:
            <code className="mx-1.5 font-mono text-zinc-300">$match</code>·
            <code className="mx-1.5 font-mono text-zinc-300">$group</code>·
            <code className="mx-1.5 font-mono text-zinc-300">$sort</code>·
            <code className="mx-1.5 font-mono text-zinc-300">$project</code>·
            <code className="mx-1.5 font-mono text-zinc-300">$lookup</code>.
          </p>
        </div>

        <div className="space-y-4">
          {snippets.map((s) => (
            <article key={s.operator} className="border border-zinc-900">
              <header className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
                <div className="flex items-center gap-3">
                  <code className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[12px] text-brand-300">
                    {s.operator}
                  </code>
                  <h3 className="text-[15px] font-medium text-zinc-100">{s.titulo}</h3>
                </div>
                <span className="hidden text-[12px] text-zinc-500 sm:inline">{s.descripcion}</span>
              </header>
              <div className="grid lg:grid-cols-2">
                <pre className="overflow-x-auto border-b border-zinc-900 bg-zinc-950 p-5 font-mono text-[12.5px] leading-relaxed text-zinc-300 lg:border-b-0 lg:border-r">
                  <code>{s.code}</code>
                </pre>
                <div className="bg-zinc-950/60">
                  <div className="border-b border-zinc-900 px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    resultado
                  </div>
                  <ul className="divide-y divide-zinc-900">
                    {s.result.map(([key, count]) => (
                      <li key={key} className="flex items-center justify-between px-5 py-2.5 font-mono text-[13px]">
                        <span className="text-zinc-300">{key}</span>
                        <span className="tabular-nums text-zinc-500">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

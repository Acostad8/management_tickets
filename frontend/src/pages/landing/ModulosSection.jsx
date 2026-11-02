const modulos = [
  {
    key: 'ventas_online',
    nombre: 'Ventas Online',
    campos: ['idPasarela', 'urlError', 'navegador', 'logApi'],
    descripcion: 'Pasarelas de pago, carritos, errores de checkout. El soporte necesita el log de la API, no un comentario genérico.',
  },
  {
    key: 'inventarios',
    nombre: 'Inventarios',
    campos: ['codigoProducto', 'cantidadDiscrepancia', 'bodega'],
    descripcion: 'Discrepancias entre lo contado y lo registrado. El ticket entra con bodega, producto y delta exactos.',
  },
  {
    key: 'compras',
    nombre: 'Compras',
    campos: ['numeroOrden', 'proveedor', 'montoDiscrepancia'],
    descripcion: 'Órdenes a proveedores y cuentas por pagar. Cada caso llega atado a la orden que lo originó.',
  },
  {
    key: 'produccion',
    nombre: 'Producción',
    campos: ['idMaquinaria', 'codigoLote', 'faseProceso', 'temperatura'],
    descripcion: 'Lotes, fases y sensores. Un incidente de mezclado necesita la temperatura real, no "la máquina falló".',
  },
  {
    key: 'ventas_sitio',
    nombre: 'Caja / POS',
    campos: ['numeroCaja', 'turno', 'cajero'],
    descripcion: 'Facturación rápida en punto de venta. El ticket identifica caja, turno y cajero sin preguntar dos veces.',
  },
];

export function ModulosSection() {
  return (
    <section id="modulos" className="border-b border-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Cinco módulos ERP, cinco realidades técnicas distintas.
          </h2>
        </div>

        <div className="divide-y divide-zinc-900 border-y border-zinc-900">
          {modulos.map((m) => (
            <article
              key={m.key}
              className="grid grid-cols-12 gap-6 py-8 transition hover:bg-zinc-900/30"
            >
              <div className="col-span-12 sm:col-span-5">
                <h3 className="text-[20px] font-medium text-zinc-100">{m.nombre}</h3>
                <code className="mt-1 inline-block font-mono text-[11px] text-zinc-500">{m.key}</code>
              </div>
              <p className="col-span-12 text-[15px] leading-relaxed text-zinc-400 sm:col-span-4">
                {m.descripcion}
              </p>
              <div className="col-span-12 flex flex-wrap gap-1.5 sm:col-span-3">
                {m.campos.map((c) => (
                  <span key={c} className="font-mono text-[11px] text-zinc-400">
                    <span className="text-zinc-600">·</span> {c}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import {
  CreditCard, Boxes, ShoppingCart, Factory, Store,
} from 'lucide-react';
import { SectionHeader } from './AudienciasSection';

const modulos = [
  {
    key: 'ventas_online',
    nombre: 'Ventas Online',
    icon: CreditCard,
    campos: ['idPasarela', 'urlError', 'navegador', 'logApi'],
    descripcion:
      'Pasarelas de pago, carritos, errores de checkout. El soporte necesita el log de la API, no un comentario genérico.',
  },
  {
    key: 'inventarios',
    nombre: 'Inventarios',
    icon: Boxes,
    campos: ['codigoProducto', 'cantidadDiscrepancia', 'bodega'],
    descripcion:
      'Discrepancias entre lo contado y lo registrado. El ticket entra con bodega, producto y delta exactos.',
  },
  {
    key: 'compras',
    nombre: 'Compras',
    icon: ShoppingCart,
    campos: ['numeroOrden', 'proveedor', 'montoDiscrepancia'],
    descripcion:
      'Órdenes a proveedores y cuentas por pagar. Cada caso llega atado a la orden que lo originó.',
  },
  {
    key: 'produccion',
    nombre: 'Producción',
    icon: Factory,
    campos: ['idMaquinaria', 'codigoLote', 'faseProceso', 'temperatura'],
    descripcion:
      'Lotes, fases y sensores. Un incidente de mezclado necesita la temperatura real, no "la máquina falló".',
  },
  {
    key: 'ventas_sitio',
    nombre: 'Caja / POS',
    icon: Store,
    campos: ['numeroCaja', 'turno', 'cajero'],
    descripcion:
      'Facturación rápida en punto de venta. El ticket identifica caja, turno y cajero sin preguntar dos veces.',
  },
];

export function ModulosSection() {
  return (
    <section id="modulos" className="relative border-b border-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <SectionHeader
          eyebrow="Módulos ERP"
          title="Cinco módulos, cinco realidades técnicas distintas."
          lead="Cada ticket entra con los campos específicos del módulo afectado — no formularios genéricos ni descripciones ambiguas."
        />

        <div className="mt-16 overflow-hidden rounded-xl border border-zinc-900">
          <div className="divide-y divide-zinc-900">
            {modulos.map(({ key, nombre, icon: Icon, descripcion, campos }) => (
              <article
                key={key}
                className="group grid grid-cols-12 items-start gap-6 px-6 py-7 transition hover:bg-zinc-900/40"
              >
                <div className="col-span-12 flex items-start gap-4 sm:col-span-5">
                  <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-brand-400 transition group-hover:border-brand-500/40">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-medium text-zinc-100">{nombre}</h3>
                    <code className="mt-1 inline-block font-mono text-[11px] text-zinc-500">{key}</code>
                  </div>
                </div>
                <p className="col-span-12 text-[14.5px] leading-relaxed text-zinc-400 sm:col-span-4">
                  {descripcion}
                </p>
                <div className="col-span-12 flex flex-wrap gap-1.5 sm:col-span-3">
                  {campos.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-[10.5px] text-zinc-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';

const samples = {
  ventas_online: {
    codigo: 'TK-2026-0012',
    titulo: 'Checkout retorna 500 al confirmar tarjeta',
    modulo: 'ventas_online',
    prioridad: 'alta',
    detallesEspecificos: {
      idPasarela: 'PAY-889',
      urlError: 'https://tienda.co/checkout/confirm',
      navegador: 'Chrome 120',
      logApi: 'ERROR 500 payment_declined — gateway timeout 30s',
    },
  },
  produccion: {
    codigo: 'TK-2026-0014',
    titulo: 'Lote detenido en fase de empaque',
    modulo: 'produccion',
    prioridad: 'critica',
    detallesEspecificos: {
      idMaquinaria: 'EMP-004',
      codigoLote: 'L-2026-11-01-A',
      faseProceso: 'empaque',
      temperatura: 72.4,
    },
  },
  inventarios: {
    codigo: 'TK-2026-0015',
    titulo: 'Diferencia 8 unidades en conteo cíclico',
    modulo: 'inventarios',
    prioridad: 'media',
    detallesEspecificos: {
      codigoProducto: 'SKU-00412',
      cantidadDiscrepancia: 8,
      bodega: 'BOG-01',
    },
  },
  compras: {
    codigo: 'TK-2026-0016',
    titulo: 'Factura no coincide con orden',
    modulo: 'compras',
    prioridad: 'alta',
    detallesEspecificos: {
      numeroOrden: 'OC-2026-00942',
      proveedor: 'Insumos del Norte S.A.S.',
      montoDiscrepancia: 142300,
    },
  },
  ventas_sitio: {
    codigo: 'TK-2026-0017',
    titulo: 'Caja no cuadra al cierre de turno',
    modulo: 'ventas_sitio',
    prioridad: 'media',
    detallesEspecificos: {
      numeroCaja: 3,
      turno: 'tarde',
      cajero: 'empleado-0192',
    },
  },
};

const tabs = Object.keys(samples);

export function PolimorfismoSection() {
  const [active, setActive] = useState('ventas_online');
  const t = samples[active];

  return (
    <section id="polimorfismo" className="border-b border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
              Un ticket.<br />
              Cinco formas.
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-zinc-400 md:col-span-7 md:pt-6">
            La misma colección <code className="font-mono text-zinc-300">tickets</code> almacena documentos
            con estructuras completamente distintas en <code className="font-mono text-zinc-300">detallesEspecificos</code>.
            MongoDB valida el esquema por módulo; los agregados siguen funcionando sobre el documento común.
            Sin tablas vacías, sin joins forzados.
          </p>
        </div>

        <div className="grid gap-0 lg:grid-cols-12">
          <div className="lg:col-span-3 lg:border-r lg:border-zinc-900">
            <div className="flex flex-wrap gap-1 lg:flex-col lg:gap-0">
              {tabs.map((k) => {
                const isActive = k === active;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setActive(k)}
                    className={`group flex items-center justify-between px-4 py-3 text-left font-mono text-[12px] transition
                      ${isActive
                        ? 'bg-zinc-900 text-zinc-50 lg:border-r-2 lg:border-brand-500 lg:bg-transparent'
                        : 'text-zinc-500 hover:text-zinc-200'}`}
                  >
                    <span>{k}</span>
                    <span className={`ml-3 h-px w-6 transition ${isActive ? 'bg-brand-500' : 'bg-zinc-800 group-hover:bg-zinc-700'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                  </div>
                  <code className="font-mono text-[11px] text-zinc-500">
                    db.tickets.insertOne(<span className="text-zinc-300">…</span>)
                  </code>
                </div>
                <code className="font-mono text-[11px] text-zinc-600">{t.codigo}</code>
              </div>
              <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed text-zinc-300">
                <code>{formatJson(t)}</code>
              </pre>
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-zinc-600">
              <span>mongodb · atlas · replica set rs0</span>
              <span className="tabular-nums">bsonType: object · esquema validado por módulo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatJson(obj) {
  const raw = JSON.stringify(obj, null, 2);
  return raw;
}

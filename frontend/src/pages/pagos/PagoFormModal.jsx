import { useEffect, useState } from 'react';
import { X, Save, Loader2, ShieldCheck } from 'lucide-react';
import { pagosService } from '../../services/pagos';
import { clientesService } from '../../services/clientes';
import { membresiasService } from '../../services/membresias';

const MEDIOS = ['efectivo', 'transferencia', 'tarjeta', 'pse', 'cheque', 'otro'];

const EMPTY = {
  clienteId: '',
  membresiaId: '',
  valor: '',
  fechaPago: new Date().toISOString().slice(0, 10),
  medioPago: 'transferencia',
  referencia: '',
  observaciones: '',
};

export function PagoFormModal({ open, onClose, onSaved, pago }) {
  const isEdit = Boolean(pago?.id);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);

  useEffect(() => {
    if (!open) return;
    setForm(pago ? {
      clienteId: pago.clienteId || '',
      membresiaId: pago.membresiaId || '',
      valor: pago.valor ?? '',
      fechaPago: pago.fechaPago || new Date().toISOString().slice(0, 10),
      medioPago: pago.medioPago || 'transferencia',
      referencia: pago.referencia || '',
      observaciones: pago.observaciones || '',
    } : EMPTY);
    setError('');
    setFieldErrors({});

    if (!isEdit) {
      clientesService.list({ estado: 'activo', size: 200, sort: 'razonSocial,asc' })
        .then((d) => setClientes(d?.content || []))
        .catch(() => setClientes([]));
    }
  }, [open, pago, isEdit]);

  useEffect(() => {
    if (!open || isEdit || !form.clienteId) {
      setMembresias([]);
      return;
    }
    membresiasService.byCliente(form.clienteId)
      .then((ms) => setMembresias(Array.isArray(ms) ? ms : []))
      .catch(() => setMembresias([]));
  }, [open, isEdit, form.clienteId]);

  if (!open) return null;

  const change = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const changeCliente = (v) => setForm((f) => ({ ...f, clienteId: v, membresiaId: '' }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSaving(true);
    try {
      const payload = {
        ...form,
        valor: Number(form.valor),
        membresiaId: form.membresiaId || null,
      };
      if (isEdit) {
        delete payload.clienteId;
        delete payload.membresiaId;
        await pagosService.update(pago.id, payload);
      } else {
        await pagosService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      setError(data?.message || 'No se pudo guardar el pago.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-zinc-50">
            {isEdit ? 'Editar pago' : 'Registrar pago'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            aria-label="Cerrar"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5">
          {!isEdit && (
            <>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Cliente <span className="ml-1 text-red-400">*</span>
                </label>
                <select
                  value={form.clienteId}
                  onChange={(e) => changeCliente(e.target.value)}
                  required
                  className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2 text-[13px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
                >
                  <option value="">— Seleccionar cliente —</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nit} · {c.razonSocial}</option>
                  ))}
                </select>
                {fieldErrors.clienteId && <p className="mt-1 text-[11px] text-red-300">{fieldErrors.clienteId}</p>}
              </div>

              <div>
                {(() => {
                  const gestionables = membresias.filter((m) => ['activa', 'suspendida', 'vencida'].includes(m.estado));
                  const requerida = gestionables.length > 0;
                  const seleccionada = membresias.find((m) => m.id === form.membresiaId);
                  const precio = seleccionada?.precio;
                  const valor = Number(form.valor);
                  const excede = seleccionada && precio != null && valor > Number(precio);
                  return (
                    <>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        Membresía {requerida
                          ? <span className="ml-1 text-red-400">* (obligatoria — el cliente tiene membresías gestionables)</span>
                          : <span className="ml-1 text-zinc-600">(opcional — el cliente no tiene membresías)</span>}
                      </label>
                      <select
                        value={form.membresiaId}
                        onChange={(e) => change('membresiaId', e.target.value)}
                        disabled={!form.clienteId}
                        required={requerida}
                        className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2 text-[13px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">— {requerida ? 'Elegí una membresía' : 'Sin asociar'} —</option>
                        {membresias.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.plan} · {m.estado} · ${Number(m.precio || 0).toLocaleString('es-CO')} · vence {m.fechaVencimiento}
                          </option>
                        ))}
                      </select>
                      {seleccionada && (
                        <div className="mt-2 space-y-1 rounded-md border border-zinc-900 bg-zinc-900/30 px-3 py-2 text-[11.5px]">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Precio membresía</span>
                            <span className="font-mono text-zinc-200">${Number(precio || 0).toLocaleString('es-CO')}</span>
                          </div>
                          {excede && (
                            <div className="text-[11px] text-red-300">
                              Valor del pago (${valor.toLocaleString('es-CO')}) supera el precio. Backend lo rechazará.
                            </div>
                          )}
                        </div>
                      )}
                      {form.membresiaId && !excede && (
                        <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-300">
                          <ShieldCheck size={11} /> Pago atómico: Pago + Membresía (pagoAlDia=true)
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </>
          )}

          {isEdit && (
            <div className="rounded-md border border-zinc-900 bg-zinc-900/30 px-3 py-2 text-[12px] text-zinc-400">
              Cliente: <span className="font-mono text-zinc-200">{pago.clienteRazonSocial || pago.clienteId}</span>
              {pago.membresiaPlan && <> · Membresía: <span className="font-mono text-zinc-200">{pago.membresiaPlan}</span></>}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ModalInput label="Valor" type="number" step="0.01" min="0.01" value={form.valor} onChange={(v) => change('valor', v)} placeholder="0.00" required error={fieldErrors.valor} />
            <ModalInput label="Fecha pago" type="date" value={form.fechaPago} onChange={(v) => change('fechaPago', v)} required error={fieldErrors.fechaPago} />
            <ModalSelect label="Medio de pago" value={form.medioPago} options={MEDIOS} onChange={(v) => change('medioPago', v)} required error={fieldErrors.medioPago} />
            <ModalInput label="Referencia" value={form.referencia} onChange={(v) => change('referencia', v)} placeholder="N° transacción, cheque..." error={fieldErrors.referencia} />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Observaciones
            </label>
            <textarea
              value={form.observaciones}
              onChange={(e) => change('observaciones', e.target.value)}
              rows={2}
              maxLength={300}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
            />
            {fieldErrors.observaciones && <p className="mt-1 text-[11px] text-red-300">{fieldErrors.observaciones}</p>}
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12.5px] text-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[12.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {isEdit ? 'Guardar cambios' : 'Registrar pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalInput({ label, value, onChange, placeholder, type = 'text', step, min, required, error }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <input
        type={type}
        step={step}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`h-9 w-full rounded-md border bg-zinc-900/50 px-2.5 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:bg-zinc-900 focus:outline-none focus:ring-1 ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:border-brand-500 focus:ring-brand-500/50'}`}
      />
      {error && <p className="mt-1 text-[11px] text-red-300">{error}</p>}
    </div>
  );
}

function ModalSelect({ label, value, options, onChange, required, error }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 w-full rounded-md border bg-zinc-900/50 px-2 text-[13px] text-zinc-100 focus:bg-zinc-900 focus:outline-none focus:ring-1 ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:border-brand-500 focus:ring-brand-500/50'}`}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-[11px] text-red-300">{error}</p>}
    </div>
  );
}

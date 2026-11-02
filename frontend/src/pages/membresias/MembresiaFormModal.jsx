import { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { membresiasService } from '../../services/membresias';
import { clientesService } from '../../services/clientes';

const MODULOS = ['ventas_online', 'inventarios', 'compras', 'produccion', 'ventas_sitio'];
const PLANES_SUGERIDOS = ['Básico', 'Profesional', 'Enterprise'];

const EMPTY = {
  clienteId: '',
  plan: '',
  modulosContratados: [],
  fechaInicio: '',
  fechaVencimiento: '',
  precio: '',
};

export function MembresiaFormModal({ open, onClose, onSaved, membresia }) {
  const isEdit = Boolean(membresia?.id);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!open) return;
    setForm(membresia ? {
      clienteId: membresia.clienteId || '',
      plan: membresia.plan || '',
      modulosContratados: membresia.modulosContratados || [],
      fechaInicio: membresia.fechaInicio || '',
      fechaVencimiento: membresia.fechaVencimiento || '',
      precio: membresia.precio ?? '',
    } : EMPTY);
    setError('');
    setFieldErrors({});

    if (!isEdit) {
      clientesService.list({ estado: 'activo', size: 200, sort: 'razonSocial,asc' })
        .then((d) => setClientes(d?.content || []))
        .catch(() => setClientes([]));
    }
  }, [open, membresia, isEdit]);

  if (!open) return null;

  const change = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const toggleModulo = (m) => {
    setForm((f) => ({
      ...f,
      modulosContratados: f.modulosContratados.includes(m)
        ? f.modulosContratados.filter((x) => x !== m)
        : [...f.modulosContratados, m],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSaving(true);
    try {
      const payload = {
        ...form,
        precio: form.precio === '' ? null : Number(form.precio),
      };
      if (isEdit) {
        delete payload.clienteId;
        await membresiasService.update(membresia.id, payload);
      } else {
        await membresiasService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      setError(data?.message || 'No se pudo guardar la membresía.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-zinc-50">
            {isEdit ? `Editar membresía · ${membresia.plan}` : 'Nueva membresía'}
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
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Cliente <span className="ml-1 text-red-400">*</span>
              </label>
              <select
                value={form.clienteId}
                onChange={(e) => change('clienteId', e.target.value)}
                required
                className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2 text-[13px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
              >
                <option value="">— Seleccionar cliente activo —</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nit} · {c.razonSocial}
                  </option>
                ))}
              </select>
              {clientes.length === 0 && (
                <p className="mt-1 text-[11px] text-amber-300">
                  No hay clientes activos. Crea uno primero en Clientes.
                </p>
              )}
              {fieldErrors.clienteId && <p className="mt-1 text-[11px] text-red-300">{fieldErrors.clienteId}</p>}
            </div>
          )}

          {isEdit && (
            <div className="rounded-md border border-zinc-900 bg-zinc-900/30 px-3 py-2 text-[12px] text-zinc-400">
              Cliente: <span className="font-mono text-zinc-200">{membresia.clienteRazonSocial || membresia.clienteId}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Plan <span className="ml-1 text-red-400">*</span>
              </label>
              <input
                type="text"
                list="planes-sugeridos"
                value={form.plan}
                onChange={(e) => change('plan', e.target.value)}
                placeholder="Básico / Profesional / Enterprise"
                required
                className={`h-9 w-full rounded-md border bg-zinc-900/50 px-2.5 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:bg-zinc-900 focus:outline-none focus:ring-1 ${fieldErrors.plan ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:border-brand-500 focus:ring-brand-500/50'}`}
              />
              <datalist id="planes-sugeridos">
                {PLANES_SUGERIDOS.map((p) => <option key={p} value={p} />)}
              </datalist>
              {fieldErrors.plan && <p className="mt-1 text-[11px] text-red-300">{fieldErrors.plan}</p>}
            </div>
            <ModalInput
              label="Precio"
              type="number"
              step="0.01"
              min="0"
              value={form.precio}
              onChange={(v) => change('precio', v)}
              placeholder="0.00"
              error={fieldErrors.precio}
            />
            <ModalInput
              label="Fecha inicio"
              type="date"
              value={form.fechaInicio}
              onChange={(v) => change('fechaInicio', v)}
              required
              error={fieldErrors.fechaInicio}
            />
            <ModalInput
              label="Fecha vencimiento"
              type="date"
              value={form.fechaVencimiento}
              onChange={(v) => change('fechaVencimiento', v)}
              required
              error={fieldErrors.fechaVencimiento}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Módulos contratados <span className="ml-1 text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MODULOS.map((m) => {
                const active = form.modulosContratados.includes(m);
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleModulo(m)}
                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-[11.5px] transition ${
                      active
                        ? 'border-brand-500/50 bg-brand-500/15 text-brand-200'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            {form.modulosContratados.length === 0 && (
              <p className="mt-1 text-[11px] text-zinc-500">Selecciona al menos un módulo.</p>
            )}
            {fieldErrors.modulosContratados && <p className="mt-1 text-[11px] text-red-300">{fieldErrors.modulosContratados}</p>}
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
            <button
              type="submit"
              disabled={saving || form.modulosContratados.length === 0}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {isEdit ? 'Guardar cambios' : 'Crear membresía'}
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

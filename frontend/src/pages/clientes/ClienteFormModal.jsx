import { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { clientesService } from '../../services/clientes';

const EMPTY = {
  nit: '',
  razonSocial: '',
  nombreContacto: '',
  emailContacto: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  pais: 'Colombia',
};

export function ClienteFormModal({ open, onClose, onSaved, cliente }) {
  const isEdit = Boolean(cliente?.id);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(cliente ? {
      nit: cliente.nit || '',
      razonSocial: cliente.razonSocial || '',
      nombreContacto: cliente.nombreContacto || '',
      emailContacto: cliente.emailContacto || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      ciudad: cliente.ciudad || '',
      pais: cliente.pais || 'Colombia',
    } : EMPTY);
    setError('');
    setFieldErrors({});
  }, [open, cliente]);

  if (!open) return null;

  const change = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit) {
        delete payload.nit;
        await clientesService.update(cliente.id, payload);
      } else {
        await clientesService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      setError(data?.message || 'No se pudo guardar el cliente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-zinc-50">
            {isEdit ? 'Editar cliente' : 'Nuevo cliente'}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ModalInput
              label="NIT"
              value={form.nit}
              onChange={(v) => change('nit', v)}
              placeholder="900123456-7"
              required
              disabled={isEdit}
              error={fieldErrors.nit}
              mono
            />
            <ModalInput
              label="Razón social"
              value={form.razonSocial}
              onChange={(v) => change('razonSocial', v)}
              placeholder="Distribuidora El Sol S.A.S."
              required
              error={fieldErrors.razonSocial}
            />
            <ModalInput
              label="Contacto"
              value={form.nombreContacto}
              onChange={(v) => change('nombreContacto', v)}
              placeholder="Nombre completo"
              error={fieldErrors.nombreContacto}
            />
            <ModalInput
              label="Email contacto"
              type="email"
              value={form.emailContacto}
              onChange={(v) => change('emailContacto', v)}
              placeholder="contacto@empresa.com"
              error={fieldErrors.emailContacto}
            />
            <ModalInput
              label="Teléfono"
              value={form.telefono}
              onChange={(v) => change('telefono', v)}
              placeholder="+57 300 1234567"
              error={fieldErrors.telefono}
            />
            <ModalInput
              label="Ciudad"
              value={form.ciudad}
              onChange={(v) => change('ciudad', v)}
              placeholder="Bogotá"
              error={fieldErrors.ciudad}
            />
            <ModalInput
              label="Dirección"
              value={form.direccion}
              onChange={(v) => change('direccion', v)}
              placeholder="Calle 45 # 12-30"
              error={fieldErrors.direccion}
            />
            <ModalInput
              label="País"
              value={form.pais}
              onChange={(v) => change('pais', v)}
              placeholder="Colombia"
              error={fieldErrors.pais}
            />
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
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {isEdit ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalInput({ label, value, onChange, placeholder, type = 'text', required, disabled, error, mono }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`h-9 w-full rounded-md border bg-zinc-900/50 px-2.5 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:bg-zinc-900 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${mono ? 'font-mono' : ''} ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:border-brand-500 focus:ring-brand-500/50'}`}
      />
      {error && <p className="mt-1 text-[11px] text-red-300">{error}</p>}
    </div>
  );
}

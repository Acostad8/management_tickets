import { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { capacitacionesService } from '../../services/capacitaciones';
import { empleadosService } from '../../services/empleados';
import { clientesService } from '../../services/clientes';

const MODULOS = ['ventas_online', 'inventarios', 'compras', 'produccion', 'ventas_sitio'];
const MODALIDADES = ['masiva', 'personalizada'];

const EMPTY = {
  titulo: '',
  descripcion: '',
  modulo: '',
  modalidad: 'masiva',
  fechaProgramada: '',
  duracionMinutos: 60,
  instructorId: '',
  clientesInvitados: [],
  cupoMaximo: '',
};

const toLocalDatetime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function CapacitacionFormModal({ open, onClose, onSaved, capacitacion }) {
  const isEdit = Boolean(capacitacion?.id);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!open) return;
    setForm(capacitacion ? {
      titulo: capacitacion.titulo || '',
      descripcion: capacitacion.descripcion || '',
      modulo: capacitacion.modulo || '',
      modalidad: capacitacion.modalidad || 'masiva',
      fechaProgramada: toLocalDatetime(capacitacion.fechaProgramada),
      duracionMinutos: capacitacion.duracionMinutos ?? 60,
      instructorId: capacitacion.instructorId || '',
      clientesInvitados: capacitacion.clientesInvitados || [],
      cupoMaximo: capacitacion.cupoMaximo ?? '',
    } : EMPTY);
    setError('');
    setFieldErrors({});

    empleadosService.list({ estado: 'activo', area: 'soporte', size: 200 })
      .then((d) => setEmpleados(d?.content || []))
      .catch(() => setEmpleados([]));

    clientesService.list({ estado: 'activo', size: 200, sort: 'razonSocial,asc' })
      .then((d) => setClientes(d?.content || []))
      .catch(() => setClientes([]));
  }, [open, capacitacion]);

  if (!open) return null;

  const change = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const toggleCliente = (id) => {
    setForm((f) => ({
      ...f,
      clientesInvitados: f.clientesInvitados.includes(id)
        ? f.clientesInvitados.filter((x) => x !== id)
        : [...f.clientesInvitados, id],
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
        modulo: form.modulo || null,
        instructorId: form.instructorId || null,
        duracionMinutos: form.duracionMinutos ? Number(form.duracionMinutos) : null,
        cupoMaximo: form.cupoMaximo === '' ? null : Number(form.cupoMaximo),
        fechaProgramada: form.fechaProgramada ? new Date(form.fechaProgramada).toISOString() : null,
      };
      if (isEdit) {
        await capacitacionesService.update(capacitacion.id, payload);
      } else {
        await capacitacionesService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      setError(data?.message || 'No se pudo guardar la capacitación.');
    } finally {
      setSaving(false);
    }
  };

  const requiereInvitados = form.modalidad === 'personalizada';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-900 bg-zinc-950 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-zinc-50">
            {isEdit ? `Editar capacitación · ${capacitacion.titulo}` : 'Nueva capacitación'}
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
          <ModalInput label="Título" value={form.titulo} onChange={(v) => change('titulo', v)} required maxLength={120} error={fieldErrors.titulo} />

          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Descripción <span className="ml-1 text-red-400">*</span>
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => change('descripcion', e.target.value)}
              required
              rows={3}
              maxLength={1000}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
            />
            {fieldErrors.descripcion && <p className="mt-1 text-[11px] text-red-300">{fieldErrors.descripcion}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ModalSelect label="Modalidad" value={form.modalidad} options={MODALIDADES} onChange={(v) => change('modalidad', v)} required error={fieldErrors.modalidad} />
            <ModalSelect label="Módulo ERP" value={form.modulo} options={MODULOS} onChange={(v) => change('modulo', v)} allowEmpty error={fieldErrors.modulo} />
            <ModalInput label="Fecha programada" type="datetime-local" value={form.fechaProgramada} onChange={(v) => change('fechaProgramada', v)} required error={fieldErrors.fechaProgramada} />
            <ModalInput label="Duración (min)" type="number" min="15" step="15" value={form.duracionMinutos} onChange={(v) => change('duracionMinutos', v)} error={fieldErrors.duracionMinutos} />
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Instructor
              </label>
              <select
                value={form.instructorId}
                onChange={(e) => change('instructorId', e.target.value)}
                className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2 text-[13px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
              >
                <option value="">— Sin asignar —</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.codigoEmpleado} · {e.nombre} {e.apellido || ''}
                  </option>
                ))}
              </select>
            </div>
            <ModalInput label="Cupo máximo" type="number" min="1" value={form.cupoMaximo} onChange={(v) => change('cupoMaximo', v)} placeholder="Sin límite" error={fieldErrors.cupoMaximo} />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Clientes invitados {requiereInvitados && <span className="ml-1 text-red-400">*</span>}
              <span className="ml-2 text-[10.5px] text-zinc-500">
                {requiereInvitados ? '(obligatorio en personalizada)' : '(vacío = masiva abierta a todos)'}
              </span>
            </label>
            <div className="max-h-48 overflow-y-auto rounded-md border border-zinc-900 bg-zinc-900/30 p-2">
              {clientes.length === 0 && <p className="text-[11.5px] text-zinc-500">No hay clientes activos.</p>}
              <div className="flex flex-wrap gap-1.5">
                {clientes.map((c) => {
                  const active = form.clientesInvitados.includes(c.id);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleCliente(c.id)}
                      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11.5px] transition ${
                        active
                          ? 'border-brand-500/50 bg-brand-500/15 text-brand-200'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {c.razonSocial}
                    </button>
                  );
                })}
              </div>
            </div>
            {requiereInvitados && form.clientesInvitados.length === 0 && (
              <p className="mt-1 text-[11px] text-amber-300">Selecciona al menos un cliente para una capacitación personalizada.</p>
            )}
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
              disabled={saving || (requiereInvitados && form.clientesInvitados.length === 0)}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {isEdit ? 'Guardar cambios' : 'Crear capacitación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalInput({ label, value, onChange, placeholder, type = 'text', step, min, maxLength, required, error }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <input
        type={type}
        step={step}
        min={min}
        maxLength={maxLength}
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

function ModalSelect({ label, value, options, onChange, required, allowEmpty, error }) {
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
        {allowEmpty && <option value="">— Ninguno —</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-[11px] text-red-300">{error}</p>}
    </div>
  );
}

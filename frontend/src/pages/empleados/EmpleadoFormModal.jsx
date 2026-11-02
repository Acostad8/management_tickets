import { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { empleadosService } from '../../services/empleados';
import { usuariosService } from '../../services/usuarios';

const AREAS = ['soporte', 'desarrollo', 'operaciones'];
const NIVELES = ['junior', 'senior', 'lead'];
const MODULOS = ['ventas_online', 'inventarios', 'compras', 'produccion', 'ventas_sitio'];

const EMPTY = {
  usuarioId: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  area: 'soporte',
  cargo: '',
  especialidad: [],
  nivel: 'junior',
  fechaIngreso: '',
};

export function EmpleadoFormModal({ open, onClose, onSaved, empleado }) {
  const isEdit = Boolean(empleado?.id);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [usuariosSoporte, setUsuariosSoporte] = useState([]);

  useEffect(() => {
    if (!open) return;
    setForm(empleado ? {
      usuarioId: empleado.usuarioId || '',
      nombre: empleado.nombre || '',
      apellido: empleado.apellido || '',
      email: empleado.email || '',
      telefono: empleado.telefono || '',
      area: empleado.area || 'soporte',
      cargo: empleado.cargo || '',
      especialidad: empleado.especialidad || [],
      nivel: empleado.nivel || 'junior',
      fechaIngreso: empleado.fechaIngreso || '',
    } : EMPTY);
    setError('');
    setFieldErrors({});

    if (!isEdit) {
      usuariosService.list({ rol: 'SOPORTE', estado: 'activo', size: 100 })
        .then((d) => setUsuariosSoporte(d?.content || []))
        .catch(() => setUsuariosSoporte([]));
    }
  }, [open, empleado, isEdit]);

  if (!open) return null;

  const change = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const toggleEspecialidad = (modulo) => {
    setForm((f) => ({
      ...f,
      especialidad: f.especialidad.includes(modulo)
        ? f.especialidad.filter((m) => m !== modulo)
        : [...f.especialidad, modulo],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSaving(true);
    try {
      const payload = { ...form, fechaIngreso: form.fechaIngreso || null };
      if (isEdit) {
        delete payload.usuarioId;
        await empleadosService.update(empleado.id, payload);
      } else {
        await empleadosService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      setError(data?.message || 'No se pudo guardar el empleado.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-zinc-50">
            {isEdit ? `Editar empleado · ${empleado.codigoEmpleado}` : 'Nuevo empleado'}
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
                Usuario (rol SOPORTE) <span className="ml-1 text-red-400">*</span>
              </label>
              <select
                value={form.usuarioId}
                onChange={(e) => change('usuarioId', e.target.value)}
                required
                className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2 text-[13px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
              >
                <option value="">— Seleccionar usuario SOPORTE —</option>
                {usuariosSoporte.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email} · {u.nombre} {u.apellido || ''}
                  </option>
                ))}
              </select>
              {usuariosSoporte.length === 0 && (
                <p className="mt-1 text-[11px] text-amber-300">
                  No hay usuarios con rol SOPORTE activos disponibles. Crea uno primero en Usuarios.
                </p>
              )}
              {fieldErrors.usuarioId && <p className="mt-1 text-[11px] text-red-300">{fieldErrors.usuarioId}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ModalInput label="Nombre" value={form.nombre} onChange={(v) => change('nombre', v)} required error={fieldErrors.nombre} />
            <ModalInput label="Apellido" value={form.apellido} onChange={(v) => change('apellido', v)} error={fieldErrors.apellido} />
            <ModalInput label="Email corporativo" type="email" value={form.email} onChange={(v) => change('email', v)} error={fieldErrors.email} />
            <ModalInput label="Teléfono" value={form.telefono} onChange={(v) => change('telefono', v)} error={fieldErrors.telefono} />
            <ModalSelect label="Área" value={form.area} options={AREAS} onChange={(v) => change('area', v)} required error={fieldErrors.area} />
            <ModalInput label="Cargo" value={form.cargo} onChange={(v) => change('cargo', v)} placeholder="Ingeniero de Soporte" error={fieldErrors.cargo} />
            <ModalSelect label="Nivel" value={form.nivel} options={NIVELES} onChange={(v) => change('nivel', v)} error={fieldErrors.nivel} />
            <ModalInput label="Fecha ingreso" type="date" value={form.fechaIngreso} onChange={(v) => change('fechaIngreso', v)} error={fieldErrors.fechaIngreso} />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Especialidad (módulos ERP)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MODULOS.map((m) => {
                const active = form.especialidad.includes(m);
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleEspecialidad(m)}
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
              {isEdit ? 'Guardar cambios' : 'Crear empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalInput({ label, value, onChange, placeholder, type = 'text', required, error }) {
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

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import {
  ticketsService, MODULOS, TIPOS, PRIORIDADES, DETALLES_SCHEMA,
} from '../../services/tickets';
import { Field } from '../../components/ui/Field';
import { useAuthStore } from '../../stores/useAuthStore';

export function TicketCreatePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'incidente',
    modulo: 'ventas_online',
    prioridad: 'media',
    clienteId: user?.clienteId || '',
  });
  const [detalles, setDetalles] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const schema = useMemo(() => DETALLES_SCHEMA[form.modulo] || [], [form.modulo]);
  const isCliente = !!user?.clienteId;

  const changeField = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const changeDetalle = (name, value) => setDetalles((d) => ({ ...d, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = { ...form, detallesEspecificos: detalles };
      if (!body.clienteId) delete body.clienteId;
      const created = await ticketsService.create(body);
      navigate(`/tickets/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear el ticket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={14} /> Volver
      </button>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Nuevo ticket</h2>

      <form onSubmit={submit} className="card space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <select className="input" value={form.tipo} onChange={(e) => changeField('tipo', e.target.value)}>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Prioridad">
            <select className="input" value={form.prioridad} onChange={(e) => changeField('prioridad', e.target.value)}>
              {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Módulo ERP" hint="Determina los campos específicos del ticket">
            <select className="input" value={form.modulo} onChange={(e) => { changeField('modulo', e.target.value); setDetalles({}); }}>
              {MODULOS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          {!isCliente && (
            <Field label="ID Cliente" hint="ObjectId del cliente afectado">
              <input className="input" value={form.clienteId} onChange={(e) => changeField('clienteId', e.target.value)} />
            </Field>
          )}
        </div>

        <Field label="Título">
          <input className="input" required maxLength={150}
                 value={form.titulo} onChange={(e) => changeField('titulo', e.target.value)} />
        </Field>

        <Field label="Descripción">
          <textarea className="input min-h-[100px]" required
                    value={form.descripcion} onChange={(e) => changeField('descripcion', e.target.value)} />
        </Field>

        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
            Detalles específicos — módulo <span className="font-mono text-brand-600">{form.modulo}</span>
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {schema.map((f) => (
              <Field key={f.name} label={f.label}>
                {f.type === 'textarea' ? (
                  <textarea className="input min-h-[80px]" value={detalles[f.name] || ''}
                            onChange={(e) => changeDetalle(f.name, e.target.value)} />
                ) : (
                  <input className="input" type={f.type || 'text'}
                         value={detalles[f.name] || ''}
                         onChange={(e) => changeDetalle(f.name, f.type === 'number' ? Number(e.target.value) : e.target.value)} />
                )}
              </Field>
            ))}
          </div>
        </div>

        {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</div>}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Guardando...' : 'Crear ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

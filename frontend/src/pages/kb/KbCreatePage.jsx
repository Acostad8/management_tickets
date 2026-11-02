import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { kbService, MODULOS_KB, ESTADOS_ARTICULO } from '../../services/kb';
import { Field } from '../../components/ui/Field';

export function KbCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '',
    contenido: '',
    modulo: 'general',
    etiquetas: '',
    estado: 'borrador',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = {
        ...form,
        etiquetas: form.etiquetas.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const created = await kbService.create(body);
      navigate(`/base-conocimiento/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear el artículo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={14} /> Volver
      </button>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Nuevo artículo</h2>

      <form onSubmit={submit} className="card space-y-4">
        <Field label="Título">
          <input className="input" required maxLength={200} value={form.titulo} onChange={(e) => change('titulo', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Módulo">
            <select className="input" value={form.modulo} onChange={(e) => change('modulo', e.target.value)}>
              {MODULOS_KB.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Estado">
            <select className="input" value={form.estado} onChange={(e) => change('estado', e.target.value)}>
              {ESTADOS_ARTICULO.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Etiquetas" hint="Separadas por coma">
          <input className="input" value={form.etiquetas} onChange={(e) => change('etiquetas', e.target.value)} placeholder="pasarela, pago, error" />
        </Field>
        <Field label="Contenido">
          <textarea className="input min-h-[200px]" required value={form.contenido} onChange={(e) => change('contenido', e.target.value)} />
        </Field>

        {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</div>}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Guardando...' : 'Crear artículo'}
          </button>
        </div>
      </form>
    </div>
  );
}

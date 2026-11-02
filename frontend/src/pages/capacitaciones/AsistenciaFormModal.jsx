import { useEffect, useState } from 'react';
import { X, Save, Loader2, UserPlus } from 'lucide-react';
import { capacitacionesService } from '../../services/capacitaciones';
import { clientesService } from '../../services/clientes';

const EMPTY = {
  clienteId: '',
  participanteNombre: '',
  participanteDocumento: '',
  participanteCargo: '',
  participanteEmail: '',
};

export function AsistenciaFormModal({ open, onClose, onRegistered, capacitacion }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setError('');

    if (capacitacion?.clientesInvitados?.length) {
      Promise.all(
        capacitacion.clientesInvitados.map((id) => clientesService.get(id).catch(() => null)),
      ).then((rs) => setClientes(rs.filter(Boolean)));
    } else {
      clientesService.list({ estado: 'activo', size: 200, sort: 'razonSocial,asc' })
        .then((d) => setClientes(d?.content || []))
        .catch(() => setClientes([]));
    }
  }, [open, capacitacion]);

  if (!open || !capacitacion) return null;

  const change = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await capacitacionesService.registrarAsistencia(capacitacion.id, {
        ...form,
        participanteEmail: form.participanteEmail || null,
        participanteCargo: form.participanteCargo || null,
      });
      onRegistered?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo registrar la asistencia.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
          <h2 className="inline-flex items-center gap-2 text-[15px] font-semibold text-zinc-50">
            <UserPlus size={14} /> Registrar asistencia
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
          <div className="rounded-md border border-zinc-900 bg-zinc-900/30 px-3 py-2 text-[12px] text-zinc-400">
            Capacitación: <span className="font-mono text-zinc-200">{capacitacion.titulo}</span>
          </div>

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
              <option value="">— Seleccionar cliente —</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.razonSocial}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ModalInput label="Nombre participante" value={form.participanteNombre} onChange={(v) => change('participanteNombre', v)} required maxLength={100} />
            <ModalInput label="Documento" value={form.participanteDocumento} onChange={(v) => change('participanteDocumento', v)} required maxLength={30} mono />
            <ModalInput label="Cargo" value={form.participanteCargo} onChange={(v) => change('participanteCargo', v)} maxLength={80} />
            <ModalInput label="Email" type="email" value={form.participanteEmail} onChange={(v) => change('participanteEmail', v)} maxLength={120} />
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
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalInput({ label, value, onChange, type = 'text', maxLength, required, mono }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        required={required}
        className={`h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50 ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

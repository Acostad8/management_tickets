import { useEffect, useState } from 'react';
import { X, Loader2, Check, Play, Pause, AlertTriangle, Ban, ArrowRight } from 'lucide-react';
import { membresiasService } from '../../services/membresias';

const ESTADO_OPCIONES = [
  {
    key: 'activa',
    label: 'Activa',
    icon: Play,
    description: 'La membresía está vigente y el cliente puede operar en los módulos contratados.',
    pillClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    activeClass: 'border-emerald-500/60 bg-emerald-500/15 ring-2 ring-emerald-500/30',
    iconClass: 'text-emerald-400',
  },
  {
    key: 'suspendida',
    label: 'Suspendida',
    icon: Pause,
    description: 'Pausa temporal (incumplimiento de pago, revisión interna). Se puede reactivar.',
    pillClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    activeClass: 'border-amber-500/60 bg-amber-500/15 ring-2 ring-amber-500/30',
    iconClass: 'text-amber-400',
  },
  {
    key: 'vencida',
    label: 'Vencida',
    icon: AlertTriangle,
    description: 'Pasó la fecha de vencimiento sin renovación. Marcar para alertas de cobranza.',
    pillClass: 'bg-red-500/10 text-red-300 border-red-500/30',
    activeClass: 'border-red-500/60 bg-red-500/15 ring-2 ring-red-500/30',
    iconClass: 'text-red-400',
  },
  {
    key: 'cancelada',
    label: 'Cancelada',
    icon: Ban,
    description: 'Terminación definitiva del contrato. Es un cambio difícil de revertir.',
    pillClass: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    activeClass: 'border-zinc-600 bg-zinc-800/80 ring-2 ring-zinc-700',
    iconClass: 'text-zinc-400',
  },
];

export function ChangeEstadoModal({ open, onClose, onSaved, membresia }) {
  const [selected, setSelected] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setSelected('');
      setError('');
    }
  }, [open]);

  if (!open || !membresia) return null;

  const current = membresia.estado;
  const currentOption = ESTADO_OPCIONES.find((o) => o.key === current);
  const selectedOption = selected ? ESTADO_OPCIONES.find((o) => o.key === selected) : null;

  const submit = async (e) => {
    e.preventDefault();
    if (!selected || selected === current) return;
    setError('');
    setSaving(true);
    try {
      await membresiasService.cambiarEstado(membresia.id, selected);
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cambiar el estado.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-900 bg-zinc-950 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-zinc-50">Cambiar estado de membresía</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            aria-label="Cerrar"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-5">
          <div className="rounded-md border border-zinc-900 bg-zinc-900/30 p-3 text-[12.5px]">
            <div className="mb-1 flex items-center justify-between gap-3 text-[11px]">
              <span className="font-mono uppercase tracking-wider text-zinc-500">Membresía</span>
              <span className="font-mono text-brand-300">{membresia.plan}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">Cliente</span>
              <span className="truncate text-zinc-200">{membresia.clienteRazonSocial || membresia.clienteId}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-zinc-900 pt-2">
              <span className="text-zinc-500">Estado actual</span>
              {currentOption && (
                <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11.5px] ${currentOption.pillClass}`}>
                  <currentOption.icon size={11} /> {currentOption.label}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Elegí el nuevo estado
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ESTADO_OPCIONES.map((o) => {
                const isCurrent = o.key === current;
                const isSelected = o.key === selected;
                const Icon = o.icon;
                return (
                  <button
                    type="button"
                    key={o.key}
                    disabled={isCurrent}
                    onClick={() => setSelected(o.key)}
                    className={`group relative flex items-start gap-3 rounded-md border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      isSelected
                        ? o.activeClass
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950`}>
                      <Icon size={14} className={o.iconClass} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-zinc-100">{o.label}</span>
                        {isCurrent && (
                          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-zinc-400">
                            actual
                          </span>
                        )}
                        {isSelected && (
                          <Check size={12} strokeWidth={3} className={o.iconClass} />
                        )}
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-zinc-400">{o.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedOption && (
            <div className="rounded-md border border-brand-500/20 bg-brand-500/5 p-3 text-[12.5px]">
              <div className="flex items-center justify-center gap-3 text-[13px]">
                {currentOption && (
                  <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11.5px] ${currentOption.pillClass}`}>
                    <currentOption.icon size={11} /> {currentOption.label}
                  </span>
                )}
                <ArrowRight size={13} className="text-brand-400" />
                <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11.5px] ${selectedOption.pillClass}`}>
                  <selectedOption.icon size={11} /> {selectedOption.label}
                </span>
              </div>
            </div>
          )}

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
              disabled={saving || !selected || selected === current}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Aplicar cambio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

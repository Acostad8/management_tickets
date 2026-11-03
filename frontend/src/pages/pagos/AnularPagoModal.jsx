import { useEffect, useState } from 'react';
import { X, Ban, Loader2, AlertTriangle } from 'lucide-react';
import { pagosService } from '../../services/pagos';

export function AnularPagoModal({ open, onClose, onAnulado, pago }) {
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setMotivo('');
      setError('');
    }
  }, [open]);

  if (!open || !pago) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await pagosService.anular(pago.id, motivo.trim());
      onAnulado?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo anular el pago.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-zinc-50">Anular pago</h2>
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
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-[12.5px] text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Acción irreversible</div>
                <div className="mt-1 text-amber-100/80">
                  Si el pago está asociado a una membresía, se marcará <span className="font-mono">pagoAlDia=false</span>.
                  La operación es atómica.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1 rounded-md border border-zinc-900 bg-zinc-900/30 px-3 py-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-zinc-500">Cliente</span>
              <span className="text-zinc-200">{pago.clienteRazonSocial || pago.clienteId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Valor</span>
              <span className="font-mono tabular-nums text-zinc-200">${Number(pago.valor).toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Fecha</span>
              <span className="font-mono text-zinc-200">{pago.fechaPago}</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Motivo de anulación <span className="ml-1 text-red-400">*</span>
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              maxLength={300}
              required
              placeholder="Describe la razón de la anulación..."
              className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
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
              disabled={saving || !motivo.trim()}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-500/40 bg-red-500/15 px-3 py-1.5 text-[12.5px] font-medium text-red-200 transition hover:border-red-500/60 hover:bg-red-500/20 disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Ban size={13} />}
              Anular pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

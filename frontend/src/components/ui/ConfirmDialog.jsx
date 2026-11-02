import { AlertTriangle, X, Loader2 } from 'lucide-react';

const VARIANTS = {
  danger: {
    icon: 'text-red-400',
    iconBg: 'bg-red-500/10 border-red-500/30',
    confirm: 'border-red-500/40 bg-red-500/15 text-red-200 hover:border-red-500/60 hover:bg-red-500/20',
  },
  warning: {
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/30',
    confirm: 'border-amber-500/40 bg-amber-500/15 text-amber-200 hover:border-amber-500/60 hover:bg-amber-500/20',
  },
  info: {
    icon: 'text-brand-400',
    iconBg: 'bg-brand-500/10 border-brand-500/30',
    confirm: 'btn-primary',
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  details,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  icon: CustomIcon,
}) {
  if (!open) return null;
  const v = VARIANTS[variant] || VARIANTS.danger;
  const Icon = CustomIcon || AlertTriangle;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl">
        <div className="flex items-start gap-4 p-5">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${v.iconBg}`}>
            <Icon size={18} className={v.icon} />
          </div>
          <div className="flex-1 pt-0.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-zinc-50">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                aria-label="Cerrar"
              >
                <X size={13} />
              </button>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-300">{message}</p>
            {details && (
              <div className="mt-3 space-y-1 rounded-md border border-zinc-900 bg-zinc-900/30 px-3 py-2 text-[11.5px]">
                {Object.entries(details).map(([k, val]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <span className="text-zinc-500">{k}</span>
                    <span className="text-zinc-200 text-right">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-900 bg-zinc-900/30 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[12.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12.5px] font-medium transition disabled:opacity-50 ${v.confirm}`}
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

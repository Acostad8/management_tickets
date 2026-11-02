import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Lock, History } from 'lucide-react';
import { ticketsService, ESTADOS, ESTADO_COLORS, PRIORIDAD_COLORS } from '../../services/tickets';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../stores/useAuthStore';

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [t, setT] = useState(null);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [replyInternal, setReplyInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [newEstado, setNewEstado] = useState('');

  const load = () => {
    ticketsService.get(id).then(setT).catch((e) => setError(e.response?.data?.message || 'Error cargando ticket'));
  };

  useEffect(() => { load(); }, [id]);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const updated = await ticketsService.responder(id, reply, replyInternal);
      setT(updated);
      setReply('');
      setReplyInternal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo enviar la respuesta');
    } finally {
      setSending(false);
    }
  };

  const changeEstado = async () => {
    if (!newEstado) return;
    try {
      const updated = await ticketsService.cambiarEstado(id, newEstado);
      setT(updated);
      setNewEstado('');
    } catch (err) {
      setError(err.response?.data?.message || 'Transición no permitida');
    }
  };

  if (error) return <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>;
  if (!t) return <div className="animate-pulse text-sm text-slate-500">Cargando...</div>;

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/tickets')} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={14} /> Volver a tickets
      </button>

      <div className="card space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{t.codigo}</div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t.titulo}</h2>
          </div>
          <div className="flex gap-2">
            <Badge className={ESTADO_COLORS[t.estado]}>{t.estado}</Badge>
            <Badge className={PRIORIDAD_COLORS[t.prioridad]}>{t.prioridad}</Badge>
            <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{t.modulo}</Badge>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{t.descripcion}</p>

        {t.detallesEspecificos && Object.keys(t.detallesEspecificos).length > 0 && (
          <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800/50">
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Detalles específicos</h4>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {Object.entries(t.detallesEspecificos).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{k}</dt>
                  <dd className="text-slate-800 dark:text-slate-200">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {hasPermission('tickets.actualizar_estado') && (
        <div className="card">
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">Cambiar estado</h3>
          <div className="flex gap-2">
            <select className="input flex-1" value={newEstado} onChange={(e) => setNewEstado(e.target.value)}>
              <option value="">Seleccionar nuevo estado...</option>
              {ESTADOS.filter((s) => s !== t.estado).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn-primary" onClick={changeEstado} disabled={!newEstado}>Aplicar</button>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Respuestas ({t.respuestas?.length || 0})
        </h3>
        <div className="space-y-3">
          {(t.respuestas || []).map((r, i) => (
            <div key={i} className={`rounded-md border p-3 ${r.esInterno ? 'border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'}`}>
              <div className="mb-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono">{r.usuarioId?.slice(-6)}</span>
                <span>•</span>
                <span>{new Date(r.fecha).toLocaleString()}</span>
                {r.esInterno && <Badge className="bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"><Lock size={10} className="mr-1" />Nota interna</Badge>}
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">{r.mensaje}</p>
            </div>
          ))}
        </div>

        <form onSubmit={sendReply} className="mt-4 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
          <textarea className="input min-h-[80px]" placeholder="Escribir respuesta..."
                    value={reply} onChange={(e) => setReply(e.target.value)} required />
          <div className="flex items-center justify-between">
            {hasPermission('tickets.responder') && (
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <input type="checkbox" checked={replyInternal} onChange={(e) => setReplyInternal(e.target.checked)} />
                Marcar como nota interna
              </label>
            )}
            <button type="submit" className="btn-primary" disabled={sending}>
              <Send size={14} /> {sending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>

      {t.historialEstados?.length > 0 && (
        <div className="card">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <History size={14} /> Historial de estados
          </h3>
          <ul className="space-y-1 text-sm">
            {t.historialEstados.map((h, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="font-mono text-xs">{new Date(h.fecha).toLocaleString()}</span>
                <span>{h.estadoAnterior || '—'}</span>
                <span>→</span>
                <Badge className={ESTADO_COLORS[h.estadoNuevo] || ''}>{h.estadoNuevo}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

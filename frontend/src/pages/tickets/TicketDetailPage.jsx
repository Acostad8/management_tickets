import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Send, Lock, History, MessageSquare, Loader2, Clock,
  Package, Tag, User, Calendar, CheckCircle2, Hash, AlertTriangle,
} from 'lucide-react';
import { ticketsService, ESTADOS, ESTADO_COLORS, PRIORIDAD_COLORS } from '../../services/tickets';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../stores/useAuthStore';

const formatDateTime = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return iso; }
};

const formatRelative = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'hace instantes';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `hace ${days} día(s)`;
  return formatDateTime(iso);
};

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
  const [changingEstado, setChangingEstado] = useState(false);

  const load = () => {
    ticketsService.get(id)
      .then(setT)
      .catch((e) => setError(e.response?.data?.message || 'Error cargando ticket'));
  };

  useEffect(() => { load(); }, [id]);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    setError('');
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
    setChangingEstado(true);
    setError('');
    try {
      const updated = await ticketsService.cambiarEstado(id, newEstado);
      setT(updated);
      setNewEstado('');
    } catch (err) {
      setError(err.response?.data?.message || 'Transición no permitida');
    } finally {
      setChangingEstado(false);
    }
  };

  const detallesEntries = useMemo(() => {
    if (!t?.detallesEspecificos) return [];
    return Object.entries(t.detallesEspecificos).filter(([, v]) => v !== null && v !== undefined && v !== '');
  }, [t]);

  if (error && !t) {
    return (
      <div className="space-y-4">
        <BackButton onClick={() => navigate('/tickets')} />
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (!t) {
    return (
      <div className="space-y-4">
        <BackButton onClick={() => navigate('/tickets')} />
        <div className="animate-pulse text-[13px] text-zinc-500">Cargando ticket…</div>
      </div>
    );
  }

  const respuestas = t.respuestas || [];
  const historial = t.historialEstados || [];

  return (
    <div className="space-y-6">
      <BackButton onClick={() => navigate('/tickets')} />

      <header className="flex flex-col gap-4 border-b border-zinc-900 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 text-[11.5px]">
            <span className="inline-flex items-center gap-1 font-mono text-brand-300">
              <Hash size={11} /> {t.codigo}
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-500">{formatRelative(t.fechaCreacion)}</span>
          </div>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-zinc-50">
            {t.titulo}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge className={ESTADO_COLORS[t.estado]}>{t.estado}</Badge>
            <Badge className={PRIORIDAD_COLORS[t.prioridad]}>{t.prioridad}</Badge>
            <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10.5px]">{t.modulo}</Badge>
            <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10.5px]">{t.tipo}</Badge>
          </div>
        </div>
      </header>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[12.5px] text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <main className="space-y-6 lg:col-span-2">
          <section className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Descripción
            </h2>
            <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-zinc-200">
              {t.descripcion}
            </p>
          </section>

          {detallesEntries.length > 0 && (
            <section className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <Package size={12} /> Detalles específicos del módulo
              </h2>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {detallesEntries.map(([k, v]) => (
                  <div key={k} className="border-l-2 border-zinc-900 pl-3">
                    <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500">{k}</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap break-words font-mono text-[12px] text-zinc-200">
                      {String(v)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {t.solucion && (
            <section className="border border-emerald-500/30 bg-emerald-500/5 p-5">
              <h2 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                <CheckCircle2 size={12} /> Solución registrada
              </h2>
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-200">
                {t.solucion.descripcion}
              </p>
              {t.solucion.fecha && (
                <p className="mt-2 font-mono text-[11px] text-emerald-300/70">
                  {formatDateTime(t.solucion.fecha)}
                </p>
              )}
            </section>
          )}

          <section className="border border-zinc-900 bg-zinc-950">
            <header className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
              <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <MessageSquare size={12} /> Conversación ({respuestas.length})
              </h2>
            </header>

            <ul className="divide-y divide-zinc-900">
              {respuestas.length === 0 && (
                <li className="px-5 py-8 text-center text-[12.5px] text-zinc-500">
                  No hay respuestas aún.
                </li>
              )}
              {respuestas.map((r, i) => (
                <li key={i} className={`px-5 py-4 ${r.esInterno ? 'bg-amber-500/[0.03]' : ''}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11.5px]">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                        <User size={10} className="text-zinc-400" />
                      </div>
                      <span className="font-mono text-zinc-400">#{r.usuarioId?.slice(-6) || '——'}</span>
                      {r.esInterno && (
                        <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                          <Lock size={9} className="mr-0.5 inline" />interna
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-zinc-600" title={formatDateTime(r.fecha)}>
                      {formatRelative(r.fecha)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap pl-8 text-[13px] leading-relaxed text-zinc-200">
                    {r.mensaje}
                  </p>
                </li>
              ))}
            </ul>

            {hasPermission('tickets.responder') && t.estado !== 'cerrado' && (
              <form onSubmit={sendReply} className="space-y-3 border-t border-zinc-900 bg-zinc-900/30 p-5">
                <textarea
                  placeholder="Escribir respuesta..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  required
                  rows={3}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
                />
                <div className="flex items-center justify-between gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-[12px] text-zinc-400">
                    <input
                      type="checkbox"
                      checked={replyInternal}
                      onChange={(e) => setReplyInternal(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 text-brand-500 focus:ring-brand-500/50"
                    />
                    <Lock size={11} /> Nota interna (no visible al cliente)
                  </label>
                  <button type="submit" disabled={sending || !reply.trim()} className="btn-primary disabled:opacity-50">
                    {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    {sending ? 'Enviando…' : 'Enviar'}
                  </button>
                </div>
              </form>
            )}

            {t.estado === 'cerrado' && (
              <div className="border-t border-zinc-900 bg-zinc-900/30 px-5 py-3 text-[12px] text-zinc-500">
                <AlertTriangle size={11} className="mr-1 inline" />
                Ticket cerrado — no se admiten nuevas respuestas.
              </div>
            )}
          </section>
        </main>

        <aside className="space-y-4">
          <section className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Metadatos
            </h2>
            <dl className="space-y-3 text-[12.5px]">
              <MetaRow icon={Calendar} label="Creado" value={formatDateTime(t.fechaCreacion)} />
              <MetaRow icon={Clock} label="Actualizado" value={formatDateTime(t.fechaActualizacion)} />
              {t.fechaCierre && <MetaRow icon={CheckCircle2} label="Cerrado" value={formatDateTime(t.fechaCierre)} />}
              <MetaRow icon={Tag} label="Tipo" value={t.tipo} mono />
              <MetaRow icon={Package} label="Módulo" value={t.modulo} mono />
              <MetaRow icon={User} label="Reportado por" value={`#${t.usuarioId?.slice(-6) || '——'}`} mono />
              {t.clienteId && <MetaRow icon={User} label="Cliente" value={`#${t.clienteId.slice(-6)}`} mono />}
              {t.empleadoAsignadoId ? (
                <MetaRow icon={User} label="Asignado a" value={`#${t.empleadoAsignadoId.slice(-6)}`} mono accent />
              ) : (
                <MetaRow icon={User} label="Asignado" value="Sin asignar" accent muted />
              )}
            </dl>
          </section>

          {hasPermission('tickets.actualizar_estado') && t.estado !== 'cerrado' && (
            <section className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Cambiar estado
              </h2>
              <div className="space-y-2">
                <select
                  value={newEstado}
                  onChange={(e) => setNewEstado(e.target.value)}
                  className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2 text-[13px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
                >
                  <option value="">— Elegir nuevo estado —</option>
                  {ESTADOS.filter((s) => s !== t.estado).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={changeEstado}
                  disabled={!newEstado || changingEstado}
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  {changingEstado ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  Aplicar
                </button>
              </div>
            </section>
          )}

          {historial.length > 0 && (
            <section className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <History size={12} /> Historial
              </h2>
              <ol className="space-y-3">
                {historial.slice().reverse().map((h, i) => (
                  <li key={i} className="relative pl-5">
                    <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-brand-500" />
                    <div className="flex items-center gap-1.5 text-[11.5px]">
                      <span className="text-zinc-500">{h.estadoAnterior || <span className="text-zinc-700">—</span>}</span>
                      <span className="text-zinc-700">→</span>
                      <Badge className={ESTADO_COLORS[h.estadoNuevo] || ''}>{h.estadoNuevo}</Badge>
                    </div>
                    <div className="mt-0.5 font-mono text-[10.5px] text-zinc-600">
                      {formatDateTime(h.fecha)}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[12.5px] text-zinc-500 transition hover:text-zinc-300"
    >
      <ArrowLeft size={13} /> Volver a tickets
    </button>
  );
}

function MetaRow({ icon: Icon, label, value, mono, accent, muted }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-1.5 text-zinc-500">
        {Icon && <Icon size={11} />} {label}
      </dt>
      <dd className={`text-right ${mono ? 'font-mono text-[12px]' : ''} ${muted ? 'text-zinc-600' : accent ? 'text-brand-300' : 'text-zinc-200'}`}>
        {value}
      </dd>
    </div>
  );
}

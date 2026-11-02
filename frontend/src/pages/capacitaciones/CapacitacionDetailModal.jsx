import { useEffect, useState } from 'react';
import { X, Plus, Trash2, Calendar, Clock, User, Users, GraduationCap } from 'lucide-react';
import { capacitacionesService } from '../../services/capacitaciones';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../stores/useAuthStore';
import { AsistenciaFormModal } from './AsistenciaFormModal';

const ESTADO_COLORS = {
  programada: 'bg-brand-500/10 text-brand-300 border border-brand-500/20',
  en_curso:   'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  finalizada: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  cancelada:  'bg-red-500/10 text-red-300 border border-red-500/20',
};

const formatDateTime = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return iso; }
};

export function CapacitacionDetailModal({ open, onClose, capacitacion, onChanged }) {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [asistenciaModal, setAsistenciaModal] = useState(false);
  const [error, setError] = useState('');
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const load = () => {
    if (!capacitacion?.id) return;
    setLoading(true);
    capacitacionesService.asistencias(capacitacion.id)
      .then(setAsistencias)
      .catch(() => setAsistencias([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (open) load(); }, [open, capacitacion?.id]);

  if (!open || !capacitacion) return null;

  const removeAsistencia = async (a) => {
    if (!window.confirm(`¿Eliminar asistencia de ${a.participanteNombre}?`)) return;
    setError('');
    try {
      await capacitacionesService.removeAsistencia(a.id);
      load();
      onChanged?.();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo eliminar la asistencia.');
    }
  };

  const puedeRegistrar = capacitacion.estado === 'programada' || capacitacion.estado === 'en_curso';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="w-full max-w-3xl rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between border-b border-zinc-900 bg-zinc-950 px-5 py-3">
            <div className="flex items-center gap-2.5">
              <GraduationCap size={16} className="text-brand-400" />
              <h2 className="text-[15px] font-semibold text-zinc-50">{capacitacion.titulo}</h2>
              <Badge className={ESTADO_COLORS[capacitacion.estado]}>{capacitacion.estado}</Badge>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
              aria-label="Cerrar"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-5 p-5">
            <section className="rounded-md border border-zinc-900 bg-zinc-900/30 p-4">
              <p className="text-[13px] text-zinc-300">{capacitacion.descripcion}</p>
            </section>

            <section className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-zinc-900 bg-zinc-900 lg:grid-cols-4">
              <InfoCell icon={Calendar} label="Programada" value={formatDateTime(capacitacion.fechaProgramada)} />
              <InfoCell icon={Clock} label="Duración" value={capacitacion.duracionMinutos ? `${capacitacion.duracionMinutos} min` : '—'} />
              <InfoCell icon={User} label="Instructor" value={capacitacion.instructorNombre || '—'} />
              <InfoCell
                icon={Users}
                label="Asistentes"
                value={`${capacitacion.asistenciasRegistradas ?? 0}${capacitacion.cupoMaximo ? ` / ${capacitacion.cupoMaximo}` : ''}`}
              />
            </section>

            <section className="flex flex-wrap items-center gap-2 text-[12px]">
              <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[11px]">
                {capacitacion.modalidad}
              </Badge>
              {capacitacion.modulo && (
                <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[11px]">
                  {capacitacion.modulo}
                </Badge>
              )}
              <span className="text-zinc-500">
                {capacitacion.clientesInvitados?.length
                  ? `${capacitacion.clientesInvitados.length} cliente(s) invitado(s)`
                  : 'Abierta a todos los clientes'}
              </span>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  Asistencias registradas ({asistencias.length})
                </h3>
                {hasPermission('asistencias.registrar') && puedeRegistrar && (
                  <button
                    onClick={() => setAsistenciaModal(true)}
                    className="inline-flex items-center gap-1 rounded-md border border-brand-500/40 bg-brand-500/15 px-2.5 py-1 text-[11.5px] font-medium text-brand-200 transition hover:border-brand-500/60 hover:bg-brand-500/20"
                  >
                    <Plus size={11} /> Registrar
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-200">
                  {error}
                </div>
              )}

              <div className="overflow-x-auto rounded-md border border-zinc-900 bg-zinc-950">
                <table className="min-w-full divide-y divide-zinc-900 text-[12.5px]">
                  <thead className="bg-zinc-900/40 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Participante</th>
                      <th className="px-3 py-2 text-left">Documento</th>
                      <th className="px-3 py-2 text-left">Cliente</th>
                      <th className="px-3 py-2 text-left">Fecha</th>
                      <th className="px-3 py-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {loading && (
                      <tr><td colSpan={5} className="px-3 py-6 text-center text-zinc-500">Cargando…</td></tr>
                    )}
                    {!loading && asistencias.length === 0 && (
                      <tr><td colSpan={5} className="px-3 py-6 text-center text-zinc-500">Sin asistencias registradas.</td></tr>
                    )}
                    {asistencias.map((a) => (
                      <tr key={a.id} className="hover:bg-zinc-900/40">
                        <td className="px-3 py-2">
                          <div className="text-zinc-100">{a.participanteNombre}</div>
                          {a.participanteCargo && <div className="text-[11px] text-zinc-500">{a.participanteCargo}</div>}
                        </td>
                        <td className="px-3 py-2 font-mono text-[11.5px] text-zinc-300">{a.participanteDocumento}</td>
                        <td className="px-3 py-2 text-zinc-300">{a.clienteRazonSocial || <span className="text-zinc-600">—</span>}</td>
                        <td className="px-3 py-2 font-mono text-[11px] text-zinc-500">{formatDateTime(a.fechaRegistro)}</td>
                        <td className="px-3 py-2 text-right">
                          {hasPermission('asistencias.eliminar') && (
                            <button
                              onClick={() => removeAsistencia(a)}
                              className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] text-red-300 transition hover:border-red-500/50 hover:bg-red-500/15"
                            >
                              <Trash2 size={10} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>

      <AsistenciaFormModal
        open={asistenciaModal}
        onClose={() => setAsistenciaModal(false)}
        onRegistered={() => { load(); onChanged?.(); }}
        capacitacion={capacitacion}
      />
    </>
  );
}

function InfoCell({ icon: Icon, label, value }) {
  return (
    <div className="bg-zinc-950 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {Icon && <Icon size={11} />} {label}
      </div>
      <div className="mt-1 text-[12.5px] text-zinc-100">{value}</div>
    </div>
  );
}

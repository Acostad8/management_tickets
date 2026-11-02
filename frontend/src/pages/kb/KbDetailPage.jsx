import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, Eye } from 'lucide-react';
import { kbService } from '../../services/kb';
import { Badge } from '../../components/ui/Badge';

export function KbDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [a, setA] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    kbService.get(id).then(setA).catch((e) => setError(e.response?.data?.message || 'Error cargando artículo'));
  }, [id]);

  const votar = async () => {
    try {
      const upd = await kbService.votarUtil(id);
      setA(upd);
    } catch {}
  };

  if (error) return <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>;
  if (!a) return <div className="animate-pulse text-sm text-slate-500">Cargando...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <button onClick={() => navigate('/base-conocimiento')} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <ArrowLeft size={14} /> Volver
      </button>

      <article className="card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{a.titulo}</h1>
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{a.estado}</Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Módulo: <span className="font-mono">{a.modulo}</span></span>
          <span className="inline-flex items-center gap-1"><Eye size={12} /> {a.vistas || 0} vistas</span>
          <span className="inline-flex items-center gap-1"><ThumbsUp size={12} /> {a.utilidad || 0} útiles</span>
        </div>
        {a.etiquetas?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {a.etiquetas.map((t) => (
              <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">#{t}</span>
            ))}
          </div>
        )}
        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
          {a.contenido}
        </div>
        <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
          <button onClick={votar} className="btn-secondary">
            <ThumbsUp size={14} /> Marcar como útil
          </button>
        </div>
      </article>
    </div>
  );
}

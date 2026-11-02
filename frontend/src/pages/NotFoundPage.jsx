import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100">404</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Página no encontrada</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">Ir al inicio</Link>
      </div>
    </div>
  );
}

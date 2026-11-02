import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export function LandingFooter({ authenticated }) {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              ¿Listo para abrir el panel?
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-400">
              Credenciales de demostración: <code className="font-mono text-zinc-300">admin@sistemasintegrados.co</code> /
              <code className="ml-1 font-mono text-zinc-300">Admin1234!</code>
            </p>
            <Link
              to={authenticated ? '/dashboard' : '/login'}
              className="group mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-zinc-50 px-5 text-[14px] font-medium text-zinc-950 transition hover:bg-white"
            >
              {authenticated ? 'Abrir panel' : 'Ingresar'}
              <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="md:col-span-5">
            <dl className="grid grid-cols-2 gap-y-3 text-[13px]">
              <dt className="text-zinc-500">Backend</dt>
              <dd className="text-right font-mono text-zinc-300">Spring Boot 3 · Java 21</dd>
              <dt className="text-zinc-500">Base de datos</dt>
              <dd className="text-right font-mono text-zinc-300">MongoDB Atlas · rs0</dd>
              <dt className="text-zinc-500">Frontend</dt>
              <dd className="text-right font-mono text-zinc-300">React 18 · Vite · Tailwind</dd>
              <dt className="text-zinc-500">Autenticación</dt>
              <dd className="text-right font-mono text-zinc-300">JWT · bcrypt · sesiones TTL</dd>
            </dl>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-zinc-900 pt-6 text-[12px] text-zinc-600 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Sistemas Integrados S.A. · Proyecto académico UFPSO</span>
          <span className="font-mono">v0.1.0 · develop</span>
        </div>
      </div>
    </footer>
  );
}

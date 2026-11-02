import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export function LandingFooter({ authenticated }) {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Un panel. Todo el soporte.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-zinc-400">
            Abre el sistema y empieza a atender tu primera solicitud en minutos.
          </p>
          <div className="mt-8">
            <Link
              to={authenticated ? '/dashboard' : '/login'}
              className="group inline-flex h-11 items-center gap-2 rounded-md bg-zinc-50 px-5 text-[14px] font-medium text-zinc-950 transition hover:bg-white"
            >
              {authenticated ? 'Abrir panel de soporte' : 'Ingresar al sistema'}
              <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-20 border-t border-zinc-900 pt-6 text-[12px] text-zinc-600">
          © {new Date().getFullYear()} Sistemas Integrados S.A.
        </div>
      </div>
    </footer>
  );
}

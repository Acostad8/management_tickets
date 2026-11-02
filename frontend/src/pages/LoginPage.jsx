import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { LogoMark } from '../components/Logo';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setSession(data);
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message
        || (status === 423 ? 'Cuenta bloqueada por múltiples intentos fallidos.' : 'No se pudo iniciar sesión.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <GridBackdrop />

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 transition hover:text-zinc-200">
          <ArrowLeft size={14} /> Volver al inicio
        </Link>
        <Link to="/" className="inline-flex items-center gap-2.5">
          <LogoMark size={20} className="text-brand-500" />
          <span className="text-[13px] font-medium text-zinc-300">Sistemas Integrados <span className="text-zinc-500">S.A.</span></span>
        </Link>
      </nav>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-sm flex-col justify-center px-6 pb-16">
        <div className="mb-10">
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-zinc-50">
            Ingresa al panel
          </h1>
          <p className="mt-2 text-[14px] text-zinc-400">
            Usa tu correo corporativo y la contraseña asignada por tu administrador.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@empresa.com"
              className="input"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Contraseña
              </label>
              <Link to="/login" className="text-[11px] text-zinc-500 transition hover:text-zinc-300">
                ¿Olvidaste?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-500 transition hover:text-zinc-200"
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-md border border-red-900/50 bg-red-950/40 px-3.5 py-2.5 text-[13px] text-red-300">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-50 text-[14px] font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-900/30 border-t-zinc-900" />
                Verificando…
              </span>
            ) : (
              <>
                Ingresar
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

function GridBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 opacity-[0.14]"
      style={{
        backgroundImage:
          'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 100%)',
      }}
      aria-hidden
    />
  );
}

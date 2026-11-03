import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Eye, EyeOff, AlertCircle, Mail, Lock,
  ShieldCheck, Loader2, Check, Inbox, Clock, CheckCircle2,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { Logo } from '../components/Logo';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [emailTouched, setEmailTouched] = useState(false);
  const emailRef = useRef(null);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => { emailRef.current?.focus(); }, []);

  const emailValid = useMemo(() => EMAIL_RE.test(email), [email]);
  const emailInvalid = emailTouched && email.length > 0 && !emailValid;

  const handleCapsLock = (e) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLock(e.getModifierState('CapsLock'));
    }
  };

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
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
      <AuroraBackdrop />
      <GridBackdrop />
      <FloatingTickets />

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 transition hover:text-zinc-200"
        >
          <ArrowLeft size={14} /> Volver al inicio
        </Link>
        <Link to="/" className="inline-flex items-center">
          <Logo variant="brand" size={20} />
        </Link>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 pb-6">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-3 py-1 text-[12px] text-zinc-300 backdrop-blur">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Mesa de ayuda operativa
          </div>
          <h1 className="text-[30px] font-semibold leading-[1.05] tracking-tight text-zinc-50 sm:text-[34px]">
            Ingresa al panel<span className="text-brand-400">.</span>
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">
            Correo corporativo y contraseña asignada por tu administrador.
          </p>
        </div>

        <form
          key={shakeKey}
          onSubmit={handleSubmit}
          onKeyUp={handleCapsLock}
          onKeyDown={handleCapsLock}
          className={['space-y-5', error ? 'animate-shake' : ''].join(' ')}
          noValidate
        >
          <div>
            <label htmlFor="email" className="label">Correo electrónico</label>
            <div className="relative">
              <Mail
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                id="email"
                ref={emailRef}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="tucorreo@empresa.com"
                aria-invalid={emailInvalid}
                className={[
                  'input pl-10 pr-10',
                  emailInvalid
                    ? 'border-red-900/70 focus:border-red-500 focus:ring-red-500/40'
                    : '',
                ].join(' ')}
              />
              {emailValid && (
                <Check
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400"
                />
              )}
            </div>
            {emailInvalid && (
              <p className="mt-1.5 text-[11.5px] text-red-400">
                Formato de correo inválido.
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
              >
                Contraseña
              </label>
              <div className="flex items-center gap-2">
                {capsLock && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300">
                    <AlertCircle size={10} /> Mayús
                  </span>
                )}
                <Link
                  to="/login"
                  className="rounded text-[11px] text-zinc-500 transition hover:text-zinc-300 focus:outline-none focus-visible:text-zinc-200 focus-visible:ring-1 focus-visible:ring-brand-500/60"
                >
                  ¿Olvidaste?
                </Link>
              </div>
            </div>
            <div className="relative">
              <Lock
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pl-10 pr-11"
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

          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-50 text-[14px] font-medium text-zinc-950 shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Verificando…
              </span>
            ) : (
              <>
                Ingresar
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-md border border-red-900/60 bg-red-950/50 px-3.5 py-2.5 text-[13px] text-red-300 backdrop-blur"
            >
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-center text-[12px] text-zinc-500">
            ¿Problemas de acceso?{' '}
            <a
              href="mailto:soporte@sistemas-integrados.co"
              className="text-zinc-300 underline-offset-4 hover:text-zinc-100 hover:underline"
            >
              Contacta a tu administrador
            </a>
          </p>
        </form>

        <footer className="mt-8 flex items-center justify-between text-[11px] text-zinc-600">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={11} /> Cifrado TLS 1.3
          </span>
          <span className="font-mono">v1.0 · build 040</span>
        </footer>
      </main>
    </div>
  );
}

function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-brand-500/[0.07] blur-[120px] animate-aurora" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[420px] w-[520px] rounded-full bg-indigo-500/[0.05] blur-[120px] animate-aurora-slow" />
      <div className="absolute bottom-[-15%] left-[-10%] h-[360px] w-[460px] rounded-full bg-cyan-500/[0.05] blur-[120px] animate-aurora-slow" />
    </div>
  );
}

function GridBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 opacity-[0.12]"
      style={{
        backgroundImage:
          'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 100%)',
      }}
      aria-hidden
    />
  );
}

function FloatingTickets() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 hidden overflow-hidden xl:block">
      <div className="absolute left-[3%] top-[16%] w-[260px] -rotate-6 animate-float">
        <MiniTicket
          code="TCK-0427"
          title="Error 500 en checkout — pasarela Wompi"
          mod="ventas_online"
          icon={<AlertCircle size={11} className="text-rose-400" />}
          prio="Alta"
          prioClass="text-rose-400 bg-rose-500/10 border-rose-500/30"
        />
      </div>

      <div
        className="absolute right-[3%] top-[22%] w-[250px] rotate-3"
        style={{ animation: 'float-y 7s ease-in-out infinite', animationDelay: '1.2s' }}
      >
        <MiniTicket
          code="TCK-0426"
          title="Discrepancia inventario bodega Norte"
          mod="inventarios"
          icon={<Clock size={11} className="text-amber-300" />}
          prio="Media"
          prioClass="text-amber-300 bg-amber-500/10 border-amber-500/30"
        />
      </div>

      <div
        className="absolute left-[5%] bottom-[12%] w-[240px] rotate-2"
        style={{ animation: 'float-y 8s ease-in-out infinite', animationDelay: '0.6s' }}
      >
        <MiniTicket
          code="TCK-0425"
          title="Lote 882 fuera de temperatura"
          mod="produccion"
          icon={<CheckCircle2 size={11} className="text-emerald-300" />}
          prio="Baja"
          prioClass="text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
        />
      </div>

      <div
        className="absolute right-[4%] bottom-[18%] w-[230px] -rotate-3"
        style={{ animation: 'float-y 9s ease-in-out infinite', animationDelay: '2s' }}
      >
        <MiniTicket
          code="TCK-0424"
          title="Caja 03 — turno noche no cierra"
          mod="ventas_sitio"
          icon={<Inbox size={11} className="text-brand-300" />}
          prio="Media"
          prioClass="text-amber-300 bg-amber-500/10 border-amber-500/30"
        />
      </div>
    </div>
  );
}

function MiniTicket({ code, title, mod, icon, prio, prioClass }) {
  return (
    <div className="rounded-lg border border-zinc-700/80 bg-zinc-900 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.95)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-zinc-500">{code}</span>
        <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9.5px] ${prioClass}`}>
          {icon} {prio}
        </span>
      </div>
      <div className="mt-1.5 line-clamp-1 text-[12px] text-zinc-200">{title}</div>
      <div className="mt-1 font-mono text-[10px] text-brand-400/80">#{mod}</div>
    </div>
  );
}

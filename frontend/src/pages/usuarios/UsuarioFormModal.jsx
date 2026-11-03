import { useEffect, useState } from 'react';
import { X, Save, Loader2, Eye, EyeOff, ShieldCheck, Check, AlertCircle, Lock } from 'lucide-react';
import { usuariosService } from '../../services/usuarios';
import { rolesService } from '../../services/roles';
import { clientesService } from '../../services/clientes';

const EMPTY = {
  email: '',
  password: '',
  nombre: '',
  apellido: '',
  telefono: '',
  clienteId: '',
  roles: [],
};

const PASSWORD_RULES = [
  { key: 'len',   label: 'Mínimo 8 caracteres',             test: (p) => p.length >= 8,          hint: '8+' },
  { key: 'upper', label: 'Una letra mayúscula (A-Z)',       test: (p) => /[A-Z]/.test(p),        hint: 'A' },
  { key: 'lower', label: 'Una letra minúscula (a-z)',       test: (p) => /[a-z]/.test(p),        hint: 'a' },
  { key: 'digit', label: 'Un número (0-9)',                 test: (p) => /\d/.test(p),           hint: '9' },
  { key: 'spec',  label: 'Un carácter especial (!@#$…)',    test: (p) => /[^A-Za-z0-9]/.test(p), hint: '!' },
];

const checks = (pw) => Object.fromEntries(PASSWORD_RULES.map((r) => [r.key, r.test(pw)]));

const strengthLevel = (pw, pwChecks) => {
  if (!pw) return { score: 0, label: 'Vacía',       color: 'bg-zinc-800',    text: 'text-zinc-500' };
  const passed = Object.values(pwChecks).filter(Boolean).length;
  const bonus = pw.length >= 12 ? 1 : 0;
  const total = passed + bonus;
  if (total <= 2)       return { score: 1, label: 'Muy débil',   color: 'bg-red-500',     text: 'text-red-300' };
  if (total === 3)      return { score: 2, label: 'Débil',       color: 'bg-orange-500',  text: 'text-orange-300' };
  if (total === 4)      return { score: 3, label: 'Media',       color: 'bg-amber-500',   text: 'text-amber-300' };
  if (total === 5)      return { score: 4, label: 'Fuerte',      color: 'bg-emerald-500', text: 'text-emerald-300' };
  return                      { score: 5, label: 'Muy fuerte',  color: 'bg-emerald-400', text: 'text-emerald-200' };
};

export function UsuarioFormModal({ open, onClose, onSaved, usuario }) {
  const isEdit = Boolean(usuario?.id);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [roles, setRoles] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!open) return;
    setForm(usuario ? {
      email: usuario.email || '',
      password: '',
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      telefono: usuario.telefono || '',
      clienteId: usuario.clienteId || '',
      roles: usuario.roles || [],
    } : EMPTY);
    setError('');
    setFieldErrors({});
    setShowPw(false);

    rolesService.list(true).then((rs) => setRoles(rs || [])).catch(() => setRoles([]));
    clientesService.list({ estado: 'activo', size: 200, sort: 'razonSocial,asc' })
      .then((d) => setClientes(d?.content || []))
      .catch(() => setClientes([]));
  }, [open, usuario]);

  if (!open) return null;

  const change = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const toggleRol = (codigo) => {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(codigo)
        ? f.roles.filter((r) => r !== codigo)
        : [...f.roles, codigo],
    }));
  };

  const pwChecks = checks(form.password);
  const pwValid = isEdit || Object.values(pwChecks).every(Boolean);
  const strength = strengthLevel(form.password, pwChecks);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSaving(true);
    try {
      if (isEdit) {
        const payload = {
          email: form.email,
          nombre: form.nombre,
          apellido: form.apellido || null,
          telefono: form.telefono || null,
          clienteId: form.clienteId || null,
        };
        await usuariosService.update(usuario.id, payload);
        if (JSON.stringify((usuario.roles || []).slice().sort()) !== JSON.stringify(form.roles.slice().sort())) {
          await usuariosService.assignRoles(usuario.id, form.roles);
        }
      } else {
        const payload = {
          email: form.email,
          password: form.password,
          nombre: form.nombre,
          apellido: form.apellido || null,
          telefono: form.telefono || null,
          clienteId: form.clienteId || null,
          roles: form.roles,
        };
        await usuariosService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      setError(data?.message || 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const requiereCliente = form.roles.includes('CLIENTE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-900 bg-zinc-950 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-zinc-50">
            {isEdit ? `Editar usuario · ${usuario.email}` : 'Nuevo usuario'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            aria-label="Cerrar"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ModalInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => change('email', v)}
              required
              maxLength={120}
              placeholder="usuario@dominio.com"
              mono
              error={fieldErrors.email}
            />
            <ModalInput
              label="Teléfono"
              value={form.telefono}
              onChange={(v) => change('telefono', v)}
              maxLength={30}
              placeholder="+57 300 1234567"
              error={fieldErrors.telefono}
            />
            <ModalInput
              label="Nombre"
              value={form.nombre}
              onChange={(v) => change('nombre', v)}
              required
              maxLength={60}
              error={fieldErrors.nombre}
            />
            <ModalInput
              label="Apellido"
              value={form.apellido}
              onChange={(v) => change('apellido', v)}
              maxLength={60}
              error={fieldErrors.apellido}
            />
          </div>

          {!isEdit && (
            <div className="rounded-md border border-zinc-900 bg-zinc-900/30 p-4">
              <label className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                <Lock size={11} /> Contraseña <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => change('password', e.target.value)}
                  required
                  placeholder="Mínimo 8 caracteres con mayúscula, minúscula, número y símbolo"
                  className={`h-10 w-full rounded-md border bg-zinc-950 pl-3 pr-10 text-[14px] text-zinc-100 placeholder:text-[12px] placeholder:text-zinc-600 focus:bg-zinc-950 focus:outline-none focus:ring-2 ${fieldErrors.password ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-800 focus:border-brand-500 focus:ring-brand-500/30'}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">Nivel de seguridad</span>
                  <span className={`font-mono font-medium ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                        n <= strength.score ? strength.color : 'bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PASSWORD_RULES.map((r) => {
                  const ok = pwChecks[r.key];
                  return (
                    <li
                      key={r.key}
                      className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[12px] transition ${
                        ok
                          ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200'
                          : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition ${
                          ok
                            ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                            : 'border-zinc-700 bg-zinc-900 text-zinc-600'
                        }`}
                      >
                        {ok ? <Check size={11} strokeWidth={3} /> : <span className="font-mono text-[9px]">{r.hint}</span>}
                      </span>
                      <span className="flex-1">{r.label}</span>
                    </li>
                  );
                })}
              </ul>

              {fieldErrors.password && (
                <p className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-red-300">
                  <AlertCircle size={11} /> {fieldErrors.password}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Roles <span className="ml-1 text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {roles.length === 0 && <p className="text-[11.5px] text-zinc-500">Cargando roles…</p>}
              {roles.map((r) => {
                const active = form.roles.includes(r.codigo);
                return (
                  <button
                    type="button"
                    key={r.codigo}
                    onClick={() => toggleRol(r.codigo)}
                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-[11.5px] transition ${
                      active
                        ? 'border-brand-500/50 bg-brand-500/15 text-brand-200'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                    title={r.descripcion || r.nombre}
                  >
                    <ShieldCheck size={10} /> {r.codigo}
                  </button>
                );
              })}
            </div>
            {form.roles.length === 0 && (
              <p className="mt-1 text-[11px] text-amber-300">Debe asignarse al menos un rol.</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Cliente asociado {requiereCliente && <span className="ml-1 text-red-400">(recomendado para rol CLIENTE)</span>}
              {!requiereCliente && <span className="ml-1 text-zinc-600">(opcional)</span>}
            </label>
            <select
              value={form.clienteId}
              onChange={(e) => change('clienteId', e.target.value)}
              className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-2 text-[13px] text-zinc-100 focus:border-brand-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
            >
              <option value="">— Interno (sin cliente) —</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nit} · {c.razonSocial}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12.5px] text-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[12.5px] text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || form.roles.length === 0 || !pwValid}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {isEdit ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalInput({ label, value, onChange, placeholder, type = 'text', maxLength, required, error, mono }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}{required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={`h-9 w-full rounded-md border bg-zinc-900/50 px-2.5 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:bg-zinc-900 focus:outline-none focus:ring-1 ${mono ? 'font-mono' : ''} ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-zinc-800 focus:border-brand-500 focus:ring-brand-500/50'}`}
      />
      {error && <p className="mt-1 text-[11px] text-red-300">{error}</p>}
    </div>
  );
}

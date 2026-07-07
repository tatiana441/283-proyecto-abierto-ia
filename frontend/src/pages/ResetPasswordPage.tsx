import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/** Página a la que llega el enlace del correo de recuperación (crea sesión temporal). */
export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [haySesion, setHaySesion] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // El enlace del correo inicia una sesión de recuperación; sin ella no se puede cambiar la clave
    supabase.auth.getSession().then(({ data }) => setHaySesion(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'PASSWORD_RECOVERY' || evento === 'SIGNED_IN') setHaySesion(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError('No pudimos actualizar la contraseña. Pide un enlace nuevo e inténtalo otra vez.');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Nueva contraseña</h1>

        {haySesion === false ? (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-slate-600 bg-monitor-bg border border-monitor rounded-lg px-4 py-3">
              Este enlace expiró o la página se abrió directamente. Pide un enlace nuevo desde
              "¿Olvidaste tu contraseña?".
            </p>
            <Link to="/recuperar" className="text-primary font-semibold text-sm hover:underline text-center">
              Pedir un enlace nuevo
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6">Escribe tu nueva contraseña (mínimo 6 caracteres).</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                Nueva contraseña
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password" minLength={6}
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-base font-normal outline-none focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                Confirmar contraseña
                <input
                  type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password" minLength={6}
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-base font-normal outline-none focus:border-primary"
                />
              </label>

              {error && (
                <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit" disabled={loading || haySesion === null}
                className="bg-primary text-white font-semibold py-3 rounded-lg cursor-pointer transition-all duration-150 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Guardando…' : 'Guardar y entrar'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

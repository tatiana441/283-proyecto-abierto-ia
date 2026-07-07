import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function RecoverPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer`,
    });
    setLoading(false);
    if (err) {
      setError('No pudimos enviar el correo. Intenta de nuevo en unos minutos.');
      return;
    }
    setSent(true);
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Recuperar contraseña</h1>

        {sent ? (
          <div role="status" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-slate-600 bg-low-bg border border-low rounded-lg px-4 py-3">
              📬 Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña.
              Revisa también la carpeta de <strong>spam</strong> — puede tardar unos minutos.
            </p>
            <Link to="/login" className="text-primary font-semibold text-sm hover:underline text-center">
              ← Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6">
              Escribe el correo con el que te registraste y te enviaremos un enlace para crear una nueva contraseña.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                Correo electrónico
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-base font-normal outline-none focus:border-primary"
                />
              </label>

              {error && (
                <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit" disabled={loading}
                className="bg-primary text-white font-semibold py-3 rounded-lg cursor-pointer transition-all duration-150 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Enviando…' : 'Enviar enlace de recuperación'}
              </button>
            </form>
            <p className="text-sm text-slate-500 mt-6 text-center">
              <Link to="/login" className="text-primary font-semibold hover:underline">← Volver a iniciar sesión</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

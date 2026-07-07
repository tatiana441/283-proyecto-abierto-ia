import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos.' : err.message);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Iniciar sesión</h1>
        <p className="text-sm text-slate-500 mb-6">Accede a MediWatch con tu correo y contraseña.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
            Correo electrónico
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-base font-normal outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
            Contraseña
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" minLength={6}
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
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/sign-up" className="text-primary font-semibold hover:underline">Regístrate</Link>
        </p>
        <p className="text-sm text-slate-500 mt-2 text-center">
          <Link to="/recuperar" className="text-primary font-semibold hover:underline">¿Olvidaste tu contraseña?</Link>
        </p>
      </div>
    </main>
  );
}

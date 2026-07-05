import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    // Si la confirmación por correo está activa, no hay sesión hasta confirmar
    if (data.session) {
      navigate('/dashboard');
    } else {
      setAviso('Cuenta creada. Revisa tu correo para confirmar el registro y luego inicia sesión.');
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Crear cuenta</h1>
        <p className="text-sm text-slate-500 mb-6">Regístrate para consultar riesgo, precios y usar el asistente.</p>

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
            Contraseña (mínimo 6 caracteres)
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password" minLength={6}
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-base font-normal outline-none focus:border-primary"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {aviso && (
            <p role="status" className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              {aviso}
            </p>
          )}

          <button
            type="submit" disabled={loading || !!aviso}
            className="bg-primary text-white font-semibold py-3 rounded-lg cursor-pointer transition-all duration-150 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}

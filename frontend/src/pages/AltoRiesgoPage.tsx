import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { topRiesgo, type ApiRiesgo } from '../lib/api';

const NIVEL_ESTILO: Record<string, string> = {
  critico: 'bg-red-50 text-red-700 border-red-200',
  alto: 'bg-orange-50 text-orange-700 border-orange-200',
  medio: 'bg-amber-50 text-amber-700 border-amber-200',
  bajo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const TENDENCIA_ICONO: Record<string, string> = {
  subiendo: '📈', bajando: '📉', estable: '➡️',
};

export default function AltoRiesgoPage() {
  const [datos, setDatos] = useState<ApiRiesgo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    topRiesgo(30)
      .then(setDatos)
      .catch(() => setError('No se pudo cargar el ranking de riesgo. Verifica que la API esté activa.'));
  }, []);

  return (
    <main id="main-content" className="py-8 pb-16 pt-24" aria-label="Medicamentos de alto riesgo">
      <div className="container max-w-[900px] mx-auto px-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link to="/dashboard" className="text-primary font-medium hover:underline">Inicio</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Alto riesgo</span>
        </nav>

        <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-slate-900 tracking-[-0.03em] mb-2">
          Principios activos con mayor riesgo de desabastecimiento
        </h1>
        <p className="text-sm text-slate-500 mb-8 max-w-[640px]">
          Score 0–100 calculado sobre las autorizaciones de importación excepcional de INVIMA
          (Medicamentos Vitales No Disponibles). Un score alto indica señales recurrentes y
          recientes de escasez{datos?.[0] ? ` · corte ${datos[0].mes}` : ''}.
        </p>

        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {!datos && !error && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600" />
          </div>
        )}

        {datos && (
          <ol className="flex flex-col gap-3 list-none p-0">
            {datos.map((r, i) => (
              <li
                key={r.principio_activo}
                className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm"
              >
                <span className="text-slate-400 font-bold text-sm w-6 text-right shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{r.principio_activo}</p>
                  <p className="text-xs text-slate-400">
                    {TENDENCIA_ICONO[r.tendencia] ?? ''} tendencia {r.tendencia} ·{' '}
                    {String((r.factores as Record<string, unknown>)?.solicitudes_12m ?? '—')} solicitudes en 12 meses
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-bold uppercase border rounded-full px-3 py-1 ${NIVEL_ESTILO[r.nivel] ?? ''}`}
                >
                  {r.nivel}
                </span>
                <span className="shrink-0 text-2xl font-extrabold text-slate-900 w-16 text-right">
                  {Math.round(r.score)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}

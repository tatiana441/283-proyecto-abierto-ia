import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarPorCategoria, type ApiMedicamento } from '../lib/api';

// ── Mapa de categorías → código ATC ─────────────────────────────────────────
// Prefijos verificados contra la BD real (principios_activos_cum.atc)
const CATEGORIAS: Record<string, {
  name: string;
  description: string;
  atcPrefix: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
}> = {
  cardiovascular: {
    name: 'Cardiovascular',
    description: 'Antihipertensivos, anticoagulantes, estatinas',
    atcPrefix: 'C',        // C = Sistema cardiovascular (956 productos en BD)
    bgColor: 'bg-rose-50/70 border-rose-100',
    iconColor: 'text-rose-500',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
  },
  diabetes: {
    name: 'Diabetes',
    description: 'Insulinas, antidiabéticos orales, incretinas',
    atcPrefix: 'A10',      // A10 = Medicamentos para diabetes (192 productos en BD)
    bgColor: 'bg-amber-50/70 border-amber-100',
    iconColor: 'text-amber-500',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-9 6 18 3-9h3" /></svg>,
  },
  neurologia: {
    name: 'Neurología / Psiquiatría',
    description: 'Antidepresivos, anticonvulsivos, ansiolíticos, analgésicos',
    atcPrefix: 'N',        // N = Sistema nervioso (1403 productos — el grupo más grande en BD)
    bgColor: 'bg-indigo-50/70 border-indigo-100',
    iconColor: 'text-indigo-500',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" /></svg>,
  },
  infectologia: {
    name: 'Infectología',
    description: 'Antibióticos (J01), antivirales (J05), antifúngicos',
    atcPrefix: 'J',        // J = Antiinfecciosos sistémicos (1147 productos en BD)
    bgColor: 'bg-green-50/70 border-green-100',
    iconColor: 'text-green-600',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  },
  gastroenterologia: {
    name: 'Gastroenterología',
    description: 'Antiácidos (A02), espasmolíticos (A03), antidiarreicos (A07)',
    atcPrefix: 'A',        // A = Aparato digestivo y metabolismo (1144 productos en BD)
    bgColor: 'bg-teal-50/70 border-teal-100',
    iconColor: 'text-teal-600',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747C20.93 11.75 19 8.25 12 3c-7 5.25-8.93 8.75-8.716 11.253A9.004 9.004 0 0 0 12 21Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" /></svg>,
  },
  oncologia: {
    name: 'Oncología',
    description: 'Antineoplásicos (L01), inmunosupresores (L04), hormonoterapia',
    atcPrefix: 'L',        // L = Antineoplásicos e inmunomoduladores (865 productos en BD)
    bgColor: 'bg-red-50/70 border-red-100',
    iconColor: 'text-red-600',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  },
  reumatologia: {
    name: 'Reumatología',
    description: 'Antiinflamatorios no esteroideos, DMARD, relajantes musculares',
    atcPrefix: 'M01',      // M01 = Antiinflamatorios/antirreumáticos (475 productos en BD)
    bgColor: 'bg-blue-50/70 border-blue-100',
    iconColor: 'text-blue-600',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  oftalmologia: {
    name: 'Oftalmología',
    description: 'Gotas oftálmicas, lubricantes, antiglaucoma, corticoides oculares',
    atcPrefix: 'S01',      // S01 = Preparados oftalmológicos (347 productos en BD)
    bgColor: 'bg-sky-50/70 border-sky-100',
    iconColor: 'text-sky-500',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" /></svg>,
  },
  dermatologia: {
    name: 'Dermatología',
    description: 'Corticoides tópicos, antifúngicos dérmicos, emolientes',
    atcPrefix: 'D',        // D = Dermatológicos (610 productos en BD)
    bgColor: 'bg-pink-50/70 border-pink-100',
    iconColor: 'text-pink-500',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M12 18.75c-5.385 0-9.75-4.365-9.75-9.75s4.365-9.75 9.75-9.75 9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75zM10 10.5h.008m3.984 0h.008" /></svg>,
  },
  respiratorio: {
    name: 'Respiratorio',
    description: 'Broncodilatadores (R03), antihistamínicos (R06), antitusivos (R05)',
    atcPrefix: 'R',        // R = Sistema respiratorio (787 productos en BD)
    bgColor: 'bg-emerald-50/70 border-emerald-100',
    iconColor: 'text-emerald-500',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h2.25a2.25 2.25 0 001.913-1.072L9 7.5l3 9 3-12 1.837 5.51A2.25 2.25 0 0018.75 12H21" /></svg>,
  },
};

function titleCase(s: string | null): string {
  if (!s) return '—';
  return s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

function nivelBadge(nivel: string | null) {
  switch (nivel?.toLowerCase()) {
    case 'alto':
    case 'critico':
      return { label: 'Alto riesgo', cls: 'bg-red-50 text-red-700 border-red-200/60' };
    case 'medio':
      return { label: 'Monitoreo', cls: 'bg-amber-50 text-amber-700 border-amber-200/60' };
    default:
      return { label: 'Disponible', cls: 'bg-green-50 text-green-700 border-green-200/60' };
  }
}

// Skeleton de carga
function MedSkeleton() {
  return (
    <div className="flex flex-col justify-between p-6 bg-white border border-slate-100 rounded-[20px] animate-pulse">
      <div className="h-5 bg-slate-200 rounded-full w-3/4 mb-3" />
      <div className="h-3.5 bg-slate-100 rounded-full w-1/2 mb-4" />
      <div className="h-6 bg-slate-100 rounded-full w-1/3 mb-6" />
      <div className="border-t border-slate-100 pt-4 flex justify-between">
        <div className="h-4 bg-slate-100 rounded-full w-1/4" />
        <div className="h-4 bg-slate-100 rounded-full w-1/5" />
      </div>
    </div>
  );
}

export default function CategoryDetailPage() {
  const { categoryId = '' } = useParams<{ categoryId: string }>();
  const categoria = CATEGORIAS[categoryId.toLowerCase()];

  const [meds, setMeds] = useState<ApiMedicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const LIMIT = 200;

  useEffect(() => {
    if (!categoria) return;
    setLoading(true);
    setError(false);
    buscarPorCategoria(categoria.atcPrefix, LIMIT)
      .then((data) => setMeds(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (!categoria) {
    return (
      <main id="main-content">
        <div className="container">
          <div className="text-center py-20 px-6">
            <div className="text-[64px] mb-4" aria-hidden="true">📋</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Categoría no encontrada</h1>
            <p className="text-slate-500 mb-6">No encontramos la categoría solicitada.</p>
            <Link
              to="/categorias"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-base px-6 py-3 rounded-lg no-underline transition-all duration-150 hover:bg-primary-dark hover:-translate-y-px cursor-pointer"
            >
              ← Volver a categorías
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="py-8 pb-16">
      <div className="container max-w-4xl pt-5">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
          <Link to="/dashboard" className="text-primary font-medium hover:underline cursor-pointer">Inicio</Link>
          <span aria-hidden="true" className="text-slate-400">›</span>
          <Link to="/categorias" className="text-primary font-medium hover:underline cursor-pointer">Categorías</Link>
          <span aria-hidden="true" className="text-slate-400">›</span>
          <span aria-current="page" className="text-slate-400">{categoria.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/categorias"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer no-underline text-slate-600"
            aria-label="Volver a categorías"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">
              {categoria.name}
            </h1>
            <p className="text-sm md:text-base text-slate-500">
              {categoria.description}
            </p>
            {!loading && !error && meds.length > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                Mostrando <span className="font-semibold text-slate-600">{meds.length}</span> medicamentos
                {meds.length === LIMIT && (
                  <span> (máximo visible — hay más en el catálogo)</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-16 px-6">
            <div className="text-[48px] mb-3" aria-hidden="true">⚠️</div>
            <p className="text-slate-500 mb-4">No pudimos cargar los medicamentos. Verifica que el backend esté corriendo.</p>
            <button
              onClick={() => { setError(false); setLoading(true); buscarPorCategoria(categoria.atcPrefix, LIMIT).then(setMeds).catch(() => setError(true)).finally(() => setLoading(false)); }}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Medications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <MedSkeleton key={i} />)
            : meds.map((med) => {
                const nombre = titleCase(med.producto);
                const principios = med.principios_activos.length
                  ? titleCase(med.principios_activos.slice(0, 2).join(', '))
                  : '—';
                const badge = nivelBadge(med.riesgo_nivel);

                return (
                  <Link
                    key={med.expediente}
                    to={`/medicamento/${med.expediente}`}
                    className="flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-[20px] hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer no-underline group text-left"
                  >
                    <div>
                      {/* Nombre */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                          {nombre}
                        </h2>
                      </div>

                      {/* Principio activo */}
                      <p className="text-xs md:text-sm text-slate-500 mb-4 font-normal">
                        Principio activo: <span className="font-semibold text-slate-700">{principios}</span>
                      </p>

                      {/* Badge de riesgo */}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badge.cls} mb-6`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                      <div>
                        {med.riesgo_score != null ? (
                          <>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                              Score de riesgo
                            </p>
                            <p className="text-base font-extrabold text-primary">
                              {Math.round(med.riesgo_score)}/100
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-400">Sin datos de riesgo</p>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                        Ver ficha
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Sin resultados */}
        {!loading && !error && meds.length === 0 && (
          <div className="text-center py-16 px-6">
            <div className="text-[48px] mb-3" aria-hidden="true">💊</div>
            <p className="text-slate-500">
              No encontramos medicamentos con código ATC <code className="font-mono bg-slate-100 px-1 rounded">{categoria.atcPrefix}</code> en el catálogo.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}

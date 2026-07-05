import { useParams, Link } from 'react-router-dom';
import { getMedicationBySlug } from '../constants/mockData';
import MedicationProfileCard from '../components/medication/MedicationProfileCard';
import RiskAnalysisSection from '../components/medication/RiskAnalysisSection';
import PricingSection from '../components/medication/PricingSection';
import MedicationTimeline from '../components/medication/MedicationTimeline';
import RelatedMedications from '../components/medication/RelatedMedications';
import NotificationsSubscription from '../components/medication/NotificationsSubscription';

export default function ResultsPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const data = getMedicationBySlug(decodeURIComponent(slug));

  if (!data) {
    return (
      <main id="main-content">
        <div className="container">
          <div className="text-center py-20 px-6">
            <div className="text-[64px] mb-4" aria-hidden="true">💊</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Medicamento no encontrado</h1>
            <p className="text-slate-500 mb-6">
              No encontramos información para «{slug}». Intenta con el nombre genérico o el principio activo.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-base px-6 py-3 rounded-lg no-underline transition-all duration-150 hover:bg-primary-dark hover:-translate-y-px cursor-pointer"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { profile, risk, pricing, timeline, alternatives } = data;

  return (
    <main id="main-content" className="py-8 pb-16" aria-label={`Resultado: ${profile.name}`}>
      <div className="container">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap pt-5">
          <Link to="/" className="text-primary font-medium hover:underline cursor-pointer">Inicio</Link>
          <span aria-hidden="true" className="text-slate-400">›</span>
          <span aria-current="page" className="text-slate-400">{profile.name}</span>
        </nav>

        {/* Page heading */}
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-slate-900 tracking-[-0.03em] mb-2">
          Resultado de Búsqueda
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Información actualizada · Fuente: INVIMA — Ministerio de Salud de Colombia
        </p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* Main column */}
          <div className="flex flex-col gap-6">
            <MedicationProfileCard profile={profile} />
            <RiskAnalysisSection risk={risk} />
            <PricingSection pricing={pricing} />
            <MedicationTimeline events={timeline} />
            <RelatedMedications alternatives={alternatives} />
          </div>

          {/* Sticky sidebar */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-[88px]">
            <NotificationsSubscription />
          </div>

        </div>
      </div>
    </main>
  );
}

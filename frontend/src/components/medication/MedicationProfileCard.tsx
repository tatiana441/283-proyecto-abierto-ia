import type { MedicationProfile } from '../../types/medication';
import { PROFILE } from '../../constants/copy';

// ─── Lookup tables (complete class strings → Tailwind scanner picks them up) ──
const STATUS_MAP: Record<MedicationProfile['regulatoryStatus'], { badge: string; dot: string }> = {
  'Aprobado':    { badge: 'bg-low-bg text-low-text',         dot: 'bg-low'     },
  'En revisión': { badge: 'bg-monitor-bg text-monitor-text', dot: 'bg-monitor' },
  'Suspendido':  { badge: 'bg-high-bg text-high-text',       dot: 'bg-high'    },
  'Retirado':    { badge: 'bg-high-bg text-high-text',       dot: 'bg-high'    },
};

interface MedicationProfileCardProps {
  profile: MedicationProfile;
}

export default function MedicationProfileCard({ profile }: MedicationProfileCardProps) {
  const {
    name, activeIngredient, therapeuticCategory,
    pharmaceuticalForm, administrationRoute, regulatoryStatus,
    atcCode, manufacturer,
  } = profile;

  const status = STATUS_MAP[regulatoryStatus];

  const fields = [
    { label: PROFILE.fields.therapeuticCategory, value: therapeuticCategory },
    { label: PROFILE.fields.pharmaceuticalForm,   value: pharmaceuticalForm  },
    { label: PROFILE.fields.administrationRoute,  value: administrationRoute },
    { label: PROFILE.fields.regulatoryStatus,     value: regulatoryStatus    },
  ];

  return (
    <article
      className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden"
      aria-label={`Perfil del medicamento ${name}`}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-linear-to-b from-primary-bg to-white">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-slate-900 tracking-[-0.03em] leading-[1.2] mb-2 wrap-break-word">
            {name}
          </h2>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <span aria-hidden="true">⚗️</span>
            <span>
              <strong>{PROFILE.fields.activeIngredient}:</strong> {activeIngredient}
            </span>
          </div>
        </div>

        {/* Regulatory status badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shrink-0 whitespace-nowrap ${status.badge}`}
          role="status"
          aria-label={`Estado regulatorio: ${regulatoryStatus}`}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`} aria-hidden="true" />
          {regulatoryStatus}
        </div>
      </div>

      {/* ── Fields grid ── */}
      <p className="text-xs font-semibold tracking-[0.08em] uppercase text-slate-400 px-6 pt-5 pb-4">
        {PROFILE.sectionTitle}
      </p>

      <dl className="grid grid-cols-2 gap-0 px-6 pb-6">
        {fields.map(({ label, value }) => (
          <div
            key={label}
            className="p-4 rounded-lg transition-colors duration-150 hover:bg-slate-50"
          >
            <dt className="text-xs font-semibold tracking-[0.06em] uppercase text-slate-400 mb-1">
              {label}
            </dt>
            <dd className="text-base font-medium text-slate-900 leading-[1.4]">
              {value || '—'}
            </dd>
          </div>
        ))}
      </dl>

      {/* ── Optional meta (ATC, manufacturer) ── */}
      {(atcCode || manufacturer) && (
        <div className="flex flex-wrap gap-4 px-6 py-4 border-t border-slate-200 bg-slate-50">
          {atcCode && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 font-medium">{PROFILE.fields.atcCode}:</span>
              <span className="text-slate-600 font-semibold font-mono bg-slate-200 px-2 py-0.5 rounded text-xs">
                {atcCode}
              </span>
            </div>
          )}
          {manufacturer && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 font-medium">{PROFILE.fields.manufacturer}:</span>
              <span className="text-slate-600 font-semibold font-mono bg-slate-200 px-2 py-0.5 rounded text-xs">
                {manufacturer}
              </span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

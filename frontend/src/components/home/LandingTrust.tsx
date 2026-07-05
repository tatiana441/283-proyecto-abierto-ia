import { FiDatabase, FiCheckCircle, FiAlertCircle, FiShield, FiTrendingUp } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { LANDING_TRUST } from '../../constants/copy';

// ── Types ─────────────────────────────────────────────────────────────────────
type TrustIconType = 'database' | 'methodology' | 'ai-check' | 'shield';
type TrustAccent   = 'blue' | 'teal' | 'orange' | 'purple';

// ── Icon & style registries ───────────────────────────────────────────────────
const ICON_MAP: Record<TrustIconType, IconType> = {
  database:    FiDatabase,
  methodology: FiCheckCircle,
  'ai-check':  FiAlertCircle,
  shield:      FiShield,
};

const ICON_BG: Record<TrustAccent, string> = {
  blue:   'bg-blue-50   border-blue-100',
  teal:   'bg-teal-50   border-teal-100',
  orange: 'bg-amber-50  border-amber-100',
  purple: 'bg-violet-50 border-violet-100',
};

const ICON_COLOR: Record<TrustAccent, string> = {
  blue:   'text-blue-500',
  teal:   'text-teal-500',
  orange: 'text-amber-500',
  purple: 'text-violet-500',
};

const TITLE_COLOR: Record<TrustAccent, string> = {
  blue:   'text-blue-700',
  teal:   'text-teal-600',
  orange: 'text-amber-600',
  purple: 'text-violet-700',
};

// ── Internal pillar card ──────────────────────────────────────────────────────
interface TrustPillarCardProps {
  iconType: TrustIconType;
  accent: TrustAccent;
  title: string;
  description: string;
}

function TrustPillarCard({ iconType, accent, title, description }: TrustPillarCardProps) {
  const Icon = ICON_MAP[iconType];

  return (
    <section id="acerca-de" className="text-white" aria-label="Acerca de">
    <div
      className="
        bg-white border border-slate-200/70 rounded-2xl p-6
        flex flex-col items-center text-center
        hover:shadow-md hover:-translate-y-1
        transition-all duration-300 cursor-default
      "
    >
      {/* Icon bubble — centered */}
      <div
        className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 shrink-0 ${ICON_BG[accent]}`}
        aria-hidden="true"
      >
        <Icon size={20} className={ICON_COLOR[accent]} />
      </div>

      <h3 className={`text-[14px] font-bold mb-2 leading-snug ${TITLE_COLOR[accent]}`}>
        {title}
      </h3>
      <p className="text-[12px] text-slate-500 leading-relaxed font-normal max-w-[200px] mx-auto">
        {description}
      </p>
    </div>
    </section>

  );
}

// ── LandingTrust (exported) ───────────────────────────────────────────────────
export default function LandingTrust() {
  const { badge, title, subtitle, pillars, sourcesTitle, source } = LANDING_TRUST;

  return (
    <section
      id="confianza"
      aria-label="Confianza y transparencia"
      className="py-20 bg-[#f6f9fd]"
    >
      <div className="container max-w-[1000px] mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#005cbf] uppercase tracking-widest mb-3">
            {badge}
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 max-w-[500px] mx-auto text-base md:text-[17px] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 4-column trust pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-10">
          {pillars.map((p) => (
            <TrustPillarCard
              key={p.id}
              iconType={p.iconType as TrustIconType}
              accent={p.accent as TrustAccent}
              title={p.title}
              description={p.description}
            />
          ))}
        </div>

        {/* Data sources banner */}
        <div className="bg-white border border-slate-200/70 rounded-2xl px-6 py-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp size={14} className="text-blue-500" />
            </div>
            <span className="text-[13px] font-bold text-slate-800 whitespace-nowrap">
              {sourcesTitle}
            </span>
          </div>

          <p className="text-[12px] text-slate-500 leading-relaxed">
            {source}
          </p>
        </div>

      </div>
    </section>
  );
}

// Reusable feature card — used in LandingFeatures and any other section
// that needs an icon + title + description layout.
import {
  FiSearch,
  FiAlertTriangle,
  FiDollarSign,
  FiClock,
  FiCpu,
  FiBell,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

// ── Types ─────────────────────────────────────────────────────────────────────
export type FeatureIconType =
  | 'search'
  | 'risk'
  | 'price'
  | 'history'
  | 'ai'
  | 'alert';

export type FeatureAccent = 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'teal';

export interface FeatureCardData {
  id: string;
  iconType: FeatureIconType;
  accent: FeatureAccent;
  title: string;
  description: string;
}

// ── Style maps ────────────────────────────────────────────────────────────────
const ICON_BG: Record<FeatureAccent, string> = {
  blue:   'bg-blue-50    border-blue-100',
  red:    'bg-red-50     border-red-100',
  green:  'bg-emerald-50 border-emerald-100',
  purple: 'bg-violet-50  border-violet-100',
  orange: 'bg-amber-50   border-amber-100',
  teal:   'bg-teal-50    border-teal-100',
};

const ICON_COLOR: Record<FeatureAccent, string> = {
  blue:   'text-blue-500',
  red:    'text-red-500',
  green:  'text-emerald-500',
  purple: 'text-violet-500',
  orange: 'text-amber-500',
  teal:   'text-teal-500',
};

const TITLE_COLOR: Record<FeatureAccent, string> = {
  blue:   'text-blue-700',
  red:    'text-red-600',
  green:  'text-emerald-600',
  purple: 'text-violet-700',
  orange: 'text-amber-600',
  teal:   'text-teal-600',
};

// ── Icon registry (react-icons/fi) ────────────────────────────────────────────
const ICON_MAP: Record<FeatureIconType, IconType> = {
  search:  FiSearch,        // Búsqueda
  risk:    FiAlertTriangle, // Monitoreo de riesgos
  price:   FiDollarSign,    // Información de precios
  history: FiClock,         // Historial
  ai:      FiCpu,           // Análisis con IA
  alert:   FiBell,          // Alertas personalizadas
};

// ── Internal FeatureIcon helper ───────────────────────────────────────────────
function FeatureIcon({ iconType, accent }: { iconType: FeatureIconType; accent: FeatureAccent }) {
  const Icon = ICON_MAP[iconType];
  return <Icon size={22} className={ICON_COLOR[accent]} aria-hidden="true" />;
}

// ── Component ─────────────────────────────────────────────────────────────────
interface FeatureCardProps {
  data: FeatureCardData;
}

export default function FeatureCard({ data }: FeatureCardProps) {
  const { iconType, accent, title, description } = data;

  return (
    <div
      className="
        group bg-[#f6f9fd] border border-slate-100 rounded-2xl p-6
        flex flex-col gap-4
        hover:bg-white hover:border-slate-200 hover:shadow-md hover:-translate-y-1
        transition-all duration-300 cursor-default
      "
    >
      {/* Icon bubble */}
      <div
        className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${ICON_BG[accent]}`}
        aria-hidden="true"
      >
        <FeatureIcon iconType={iconType} accent={accent} />
      </div>

      {/* Text */}
      <div>
        <h3 className={`text-[15px] font-bold mb-2 leading-snug ${TITLE_COLOR[accent]}`}>
          {title}
        </h3>
        <p className="text-[13px] text-slate-500 leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </div>
  );
}

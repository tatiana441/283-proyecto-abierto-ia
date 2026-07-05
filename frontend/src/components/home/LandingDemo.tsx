import { Link } from 'react-router-dom';
import { FiCheckCircle, FiActivity, FiArrowRight, FiInfo } from 'react-icons/fi';
import { LANDING_DEMO } from '../../constants/copy';

// ── Trend bar colours: simulate Losartán's 30-day declining availability ──────
const TREND_COLORS = [
  'bg-emerald-400', 'bg-emerald-400', 'bg-emerald-400', 'bg-emerald-400', 'bg-emerald-400',
  'bg-emerald-400', 'bg-emerald-400', 'bg-amber-400',   'bg-amber-400',   'bg-emerald-400',
  'bg-emerald-400', 'bg-amber-400',   'bg-amber-400',   'bg-amber-400',   'bg-amber-400',
  'bg-red-400',     'bg-amber-400',   'bg-amber-400',   'bg-red-400',     'bg-amber-400',
  'bg-red-400',     'bg-red-400',     'bg-amber-400',   'bg-red-400',     'bg-red-400',
  'bg-amber-400',   'bg-red-400',     'bg-red-400',     'bg-red-400',     'bg-red-400',
];

// ── Badge variant styles ───────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, string> = {
  blue:  'bg-blue-50  text-blue-700  border border-blue-100',
  amber: 'bg-amber-50 text-amber-700 border border-amber-100',
  red:   'bg-red-50   text-red-700   border border-red-100',
};

// ── Stat value colours ────────────────────────────────────────────────────────
const STAT_COLOR: Record<string, string> = {
  amber: 'text-amber-500',
  red:   'text-red-500',
  blue:  'text-blue-600',
  green: 'text-emerald-500',
};

// ── Internal: Mock Medication Card ───────────────────────────────────────────
function MedicationDemoCard() {
  const { card, ctaLabel } = LANDING_DEMO;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 w-full max-w-[440px] mx-auto">

      {/* Card header */}
      <div className="flex items-start justify-between mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {card.label}
        </span>
        <div className="w-7 h-7 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <FiActivity size={14} className="text-blue-500" />
        </div>
      </div>

      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {card.name}
      </h3>
      <p className="text-[13px] text-slate-400 mb-4 mt-0.5">{card.description}</p>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        {card.badges.map((b) => (
          <span
            key={b.text}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLES[b.variant]}`}
          >
            <FiActivity size={10} />
            {b.text}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {card.stats.map((s) => (
          <div
            key={s.label}
            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-center"
          >
            <p className={`text-xl font-extrabold leading-none mb-1 ${STAT_COLOR[s.color]}`}>
              {s.value}
            </p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Trend bar chart */}
      <p className="text-[11px] text-slate-400 font-medium mb-2">{card.trendLabel}</p>
      <div className="flex gap-[2.5px] items-end h-8 mb-1">
        {TREND_COLORS.map((color, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${color}`}
            style={{ height: `${60 + Math.sin(i * 0.8) * 30}%` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 mb-5">
        <span>Hace 30 días</span>
        <span>Hoy</span>
      </div>

      {/* AI Analysis box */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <FiInfo size={12} className="text-blue-600" />
          </div>
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            {card.aiTitle}
          </span>
        </div>
        <p className="text-[12px] text-slate-600 leading-relaxed">{card.aiText}</p>
      </div>

      {/* CTA */}
      <Link
        to="/medicamento/losartán"
        className="
          flex items-center justify-center gap-2 w-full
          bg-[#005cbf] hover:bg-blue-700 active:bg-blue-800
          text-white font-bold text-sm py-3.5 rounded-xl
          cursor-pointer transition-all duration-200
          hover:shadow-lg hover:-translate-y-px active:translate-y-0 no-underline
        "
      >
        {ctaLabel}
        <FiArrowRight size={15} />
      </Link>
    </div>
  );
}

// ── LandingDemo (exported) ────────────────────────────────────────────────────
export default function LandingDemo() {
  const { badge, title, description, checkItems } = LANDING_DEMO;

  return (
    <section
      id="demo"
      aria-label="Ejemplo de monitoreo"
      className="py-20 bg-[#f6f9fd]"
    >
      <div className="container max-w-[1100px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* ── Left: copy ──────────────────────────────────────────────────── */}
          <div>
            <p className="text-xs font-bold text-[#005cbf] uppercase tracking-widest mb-3">
              {badge}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-5">
              {title}
            </h2>
            <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-[440px]">
              {description}
            </p>

            {/* Checklist */}
            <ul className="space-y-4" role="list">
              {checkItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <FiCheckCircle
                    size={18}
                    className="text-emerald-500 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-[15px] text-slate-700 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: mock card ─────────────────────────────────────────────── */}
          <div className="flex justify-center lg:justify-end">
            <MedicationDemoCard />
          </div>

        </div>
      </div>
    </section>
  );
}

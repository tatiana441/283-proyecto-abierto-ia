import { LANDING_PERSONAS } from '../../constants/copy';

// ── Reusable persona card ─────────────────────────────────────────────────────
interface PersonaCardProps {
  emoji: string;
  title: string;
  description: string;
}

function PersonaCard({ emoji, title, description }: PersonaCardProps) {
  return (
    <div
      className="
        bg-white border border-slate-200/70 rounded-2xl p-8
        flex flex-col items-center text-center
        hover:shadow-md hover:-translate-y-1
        transition-all duration-300 cursor-default
      "
    >
      {/* Emoji icon */}
      <span
        className="text-5xl mb-5 leading-none select-none"
        role="img"
        aria-label={title}
      >
        {emoji}
      </span>

      {/* Title */}
      <h3 className="text-base font-bold text-[#005cbf] mb-3 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[13px] text-slate-500 leading-relaxed font-normal max-w-[220px] mx-auto">
        {description}
      </p>
    </div>
  );
}

// ── LandingPersonas (exported) ────────────────────────────────────────────────
export default function LandingPersonas() {
  const { badge, title, subtitle, personas } = LANDING_PERSONAS;

  return (
    <section
      id="para-quien"
      aria-label="Para quién es MediWatch"
      className="py-20 bg-white"
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
          <p className="text-slate-500 max-w-[540px] mx-auto text-base md:text-[17px] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 3-column persona grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {personas.map((p) => (
            <PersonaCard
              key={p.id}
              emoji={p.emoji}
              title={p.title}
              description={p.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

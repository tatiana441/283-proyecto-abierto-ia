import { useEffect, useRef, useState } from 'react';

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: 'blue' | 'red' | 'green' | string;
}

interface LandingStatsProps {
  badge: string;
  title: string;
  subtitle: string;
  stats: StatItem[];
}

// Duration of the count animation in milliseconds
const ANIMATION_DURATION = 1800;
// Easing function: ease-out cubic
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const colorMap: Record<string, string> = {
  blue: 'text-[#005cbf]',
  red: 'text-red-500',
  green: 'text-emerald-500',
};

export default function LandingStats({ badge, title, subtitle, stats }: LandingStatsProps) {
  // One single "triggered" flag so all counters start/stop simultaneously
  const [triggered, setTriggered] = useState(false);
  // Stores the animated display value for each stat (keyed by id)
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(stats.map((s) => [s.id, 0]))
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // ── IntersectionObserver: fire once when section enters viewport ──────────
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [triggered]);

  // ── Animation loop: run when triggered ───────────────────────────────────
  useEffect(() => {
    if (!triggered) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easedProgress = easeOut(progress);

      const newCounts: Record<string, number> = {};
      stats.forEach((s) => {
        newCounts[s.id] = Math.round(s.value * easedProgress);
      });
      setCounts(newCounts);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure all values land exactly on their targets
        const finalCounts: Record<string, number> = {};
        stats.forEach((s) => { finalCounts[s.id] = s.value; });
        setCounts(finalCounts);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [triggered, stats]);

  // ── Number formatter: adds thousands separators ───────────────────────────
  const formatValue = (num: number) =>
    num.toLocaleString('es-CO');

  return (
    <section
      id="estadisticas"
      aria-label="Estadísticas de impacto"
      className="py-20 bg-white"
    >
      <div className="container max-w-[1000px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">
            {badge}
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 max-w-[520px] mx-auto text-base md:text-[17px] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Stat Cards */}
        <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const colorClass = colorMap[stat.color] ?? 'text-[#005cbf]';
            return (
              <div
                key={stat.id}
                className="
                  bg-white border border-slate-200/80 rounded-2xl p-6
                  flex flex-col items-center text-center
                  shadow-sm hover:shadow-md hover:-translate-y-1
                  transition-all duration-300 cursor-default
                "
              >
                {/* Animated number */}
                <span
                  className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-none mb-3 ${colorClass}`}
                  aria-live="polite"
                  aria-label={`${stat.value}${stat.suffix}`}
                >
                  {formatValue(counts[stat.id])}{stat.suffix}
                </span>

                {/* Label */}
                <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                  {stat.label}
                </h3>

                {/* Sublabel */}
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {stat.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

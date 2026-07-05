import type { TimelineEvent } from '../../types/medication';
import { TIMELINE } from '../../constants/copy';

// Lookup tables — complete class strings so Tailwind scanner picks them up
const EVENT_ICON: Record<TimelineEvent['type'], string> = {
  approval:   '✅',
  shortage:   '⚠️',
  alert:      '🚨',
  resolved:   '🟢',
  monitoring: '👁️',
};

const EVENT_ICON_BG: Record<TimelineEvent['type'], string> = {
  approval:   'bg-low-bg    border-low     text-low',
  shortage:   'bg-monitor-bg border-monitor text-monitor',
  alert:      'bg-high-bg   border-high     text-high',
  resolved:   'bg-low-bg    border-low     text-low',
  monitoring: 'bg-primary-bg border-primary text-primary',
};

interface MedicationTimelineProps { events: TimelineEvent[]; }

export default function MedicationTimeline({ events }: MedicationTimelineProps) {
  const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return (
    <section
      className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden"
      aria-labelledby="timeline-section-title"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
        <span className="text-[22px]" aria-hidden="true">📋</span>
        <h2 id="timeline-section-title" className="text-lg font-bold text-slate-900 tracking-[-0.02em]">
          {TIMELINE.sectionTitle}
        </h2>
      </div>

      {/* Timeline list — uses .timeline-item global class (connector ::after defined in index.css) */}
      <ol className="p-6 flex flex-col gap-1" aria-label={TIMELINE.sectionTitle}>
        {sorted.map(event => (
          <li
            key={event.id}
            className="timeline-item pb-5 last:pb-0"
          >
            {/* Icon bubble */}
            <div
              className={`relative z-10 shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center text-base ${EVENT_ICON_BG[event.type]}`}
              aria-hidden="true"
            >
              {EVENT_ICON[event.type]}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                <h3 className="text-base font-semibold text-slate-900 leading-snug">{event.title}</h3>
                <time
                  className="text-xs text-slate-400 font-medium whitespace-nowrap shrink-0 mt-1"
                  dateTime={event.date}
                >
                  {formatDate(event.date)}
                </time>
              </div>
              <p className="text-sm text-slate-500 leading-[1.6]">{event.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

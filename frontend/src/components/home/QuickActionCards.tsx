import { Link } from 'react-router-dom';
import { HOME } from '../../constants/copy';

/* Lookup tables use complete class strings so Tailwind's scanner picks them up */
const ACCENT_BG: Record<string, string> = {
  primary: 'bg-primary',
  high:    'bg-high',
  monitor: 'bg-monitor',
  low:     'bg-low',
};

const ICON_BG: Record<string, string> = {
  primary: 'bg-primary-bg',
  high:    'bg-high-bg',
  monitor: 'bg-monitor-bg',
  low:     'bg-low-bg',
};

export default function QuickActionCards() {
  return (
    <section className="py-16 bg-[#eeeef7]" aria-labelledby="quick-actions-title">
      <div className="container">
        <div className="text-center mb-10">
          <h2 id="quick-actions-title" className="text-2xl font-bold text-slate-900 mb-2 tracking-[-0.02em]">
            {HOME.quickActionsTitle}
          </h2>
          <p className="text-slate-500 text-base">Accede rápidamente a la información que necesitas</p>
        </div>

        <div className="flex justify-center gap-5 flex-col md:flex-row" role="list">
          {HOME.actions.map(action => (
            <Link
              key={action.id}
              to={action.href}
              className="group relative flex flex-col items-start bg-white border border-slate-200 rounded-2xl p-6 no-underline cursor-pointer transition-all duration-250 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-slate-100 overflow-hidden gap-4"
              role="listitem"
              aria-label={`${action.title}: ${action.description}`}
            >
              {/* Colored top accent strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl transition-all duration-250 group-hover:h-1 ${ACCENT_BG[action.color]}`}
                aria-hidden="true"
              />

              {/* Icon */}
              <div
                className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl shrink-0 transition-transform duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-[-5deg] ${ICON_BG[action.color]}`}
                aria-hidden="true"
              >
                {action.icon}
              </div>

              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-2 tracking-[-0.01em] leading-snug">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-500 leading-normal">{action.description}</p>
              </div>

              <span
                className="text-lg text-slate-400 mt-auto self-end transition-all duration-150 group-hover:translate-x-1 group-hover:text-primary"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

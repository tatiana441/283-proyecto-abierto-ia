import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AlternativeMedication } from '../../types/medication';
import { RELATED } from '../../constants/copy';

const RISK_BADGE: Record<string, string> = {
  low:     'bg-low-bg text-low-text',
  monitor: 'bg-monitor-bg text-monitor-text',
  high:    'bg-high-bg text-high-text',
};

const RISK_DOT: Record<string, string> = {
  low:     'bg-low',
  monitor: 'bg-monitor',
  high:    'bg-high',
};

interface RelatedMedicationsProps { alternatives: AlternativeMedication[]; }

export default function RelatedMedications({ alternatives }: RelatedMedicationsProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section
      className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden"
      aria-labelledby="alternatives-section-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[22px]" aria-hidden="true">🔄</span>
          <h2 id="alternatives-section-title" className="text-lg font-bold text-slate-900 tracking-[-0.02em]">
            {RELATED.alternativesTitle}
          </h2>
        </div>
        <button
          className="text-xs font-semibold text-primary bg-primary-bg px-3 py-1.5 rounded-full border border-primary/20 transition-colors hover:bg-primary hover:text-white cursor-pointer"
          onClick={() => setShowInfo(p => !p)}
          aria-expanded={showInfo}
          aria-controls="alt-edu-panel"
        >
          {showInfo ? '✕ Cerrar' : '¿Qué es esto?'}
        </button>
      </div>

      {/* Collapsible education panel */}
      {showInfo && (
        <div
          id="alt-edu-panel"
          className="mx-6 mt-4 bg-primary-bg border border-primary/15 border-l-4 border-l-primary rounded-lg p-4 text-sm text-slate-500 leading-[1.7] animate-[fade-in_0.25s_ease]"
          role="region"
          aria-label="Información sobre alternativas terapéuticas"
        >
          {RELATED.educationBody}
        </div>
      )}

      {/* Cards — horizontal scroll on mobile */}
      <div className="p-6">
        {alternatives.length === 0 ? (
          <p className="text-center text-slate-400 py-8 text-sm">{RELATED.consultLabel}</p>
        ) : (
          <ul
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
            aria-label="Lista de alternativas terapéuticas"
            role="list"
          >
            {alternatives.map(alt => (
              <li
                key={alt.id}
                className="shrink-0 w-[240px] bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 snap-start hover:shadow-md hover:border-slate-300 transition-all duration-250"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 leading-snug mb-0.5">{alt.name}</h3>
                    <p className="text-xs text-slate-400 font-medium truncate">{alt.activeIngredient}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${RISK_BADGE[alt.riskLevel]}`}
                    aria-label={`Riesgo: ${alt.riskLevel}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${RISK_DOT[alt.riskLevel]}`} aria-hidden="true" />
                    {alt.riskScore}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 rounded-lg px-3 py-2">
                  <span aria-hidden="true">🔗</span>
                  <span className="truncate">{alt.similarity}</span>
                </div>

                <Link
                  to={`/medicamento/${alt.id}`}
                  className="w-full block text-center no-underline bg-white border border-slate-200 text-primary text-sm font-semibold py-2 px-3 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-150 cursor-pointer"
                  aria-label={`Ver detalles de ${alt.name}`}
                >
                  Ver detalles
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

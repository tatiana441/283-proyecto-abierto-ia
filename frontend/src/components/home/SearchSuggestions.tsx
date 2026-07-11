import type { ApiMedicamento } from '../../lib/api';

interface Props {
  suggestions: ApiMedicamento[];
  activeIndex: number;
  onSelect: (med: ApiMedicamento) => void;
  isLoading: boolean;
  query: string;
}

/** Resalta la parte del texto que coincide con la búsqueda */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/15 text-primary font-semibold rounded-[2px] not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Skeleton row mostrado mientras se carga */
function SkeletonRow() {
  return (
    <li className="flex items-center gap-3 px-4 py-3" aria-hidden="true">
      <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-3.5 bg-slate-200 animate-pulse rounded-full w-3/5" />
        <div className="h-3 bg-slate-100 animate-pulse rounded-full w-2/5" />
      </div>
    </li>
  );
}

/**
 * Dropdown de sugerencias de medicamentos.
 * Se posiciona absolutamente bajo el input de búsqueda.
 * Soporta: hover, navegación por teclado, resaltado de coincidencia y skeleton loader.
 */
export default function SearchSuggestions({
  suggestions,
  activeIndex,
  onSelect,
  isLoading,
  query,
}: Props) {
  const titleCase = (s: string | null) => {
    if (!s) return '—';
    return s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  };

  return (
    <div
      className="search-dropdown absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-white border border-slate-200 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden"
      role="listbox"
      aria-label="Sugerencias de medicamentos"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Medicamentos sugeridos
        </span>
        {isLoading && (
          <span className="text-[11px] text-primary animate-pulse">Buscando…</span>
        )}
      </div>

      <ul className="py-1 max-h-[300px] overflow-y-auto overscroll-contain">
        {/* Estado de carga: skeletons */}
        {isLoading && suggestions.length === 0 && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}

        {/* Sin resultados */}
        {!isLoading && suggestions.length === 0 && (
          <li className="flex flex-col items-center gap-1 py-6 text-center">
            <span className="text-2xl" aria-hidden="true">🔍</span>
            <span className="text-sm text-slate-500">No encontramos coincidencias</span>
            <span className="text-xs text-slate-400">
              Intenta con el principio activo o nombre genérico
            </span>
          </li>
        )}

        {/* Lista de sugerencias */}
        {suggestions.map((med, index) => {
          const isActive = index === activeIndex;
          const nombre = titleCase(med.producto);
          const principios = med.principios_activos.length
            ? titleCase(med.principios_activos.slice(0, 2).join(', '))
            : null;
          const nivel = med.riesgo_nivel?.toLowerCase();

          return (
            <li
              key={med.expediente}
              id={`suggestion-${med.expediente}`}
              role="option"
              aria-selected={isActive}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-100 select-none ${
                isActive ? 'bg-primary/8' : 'hover:bg-slate-50'
              }`}
              onMouseDown={(e) => {
                // Prevenir que el blur del input dispare el cierre antes del click
                e.preventDefault();
                onSelect(med);
              }}
            >
              {/* Icono / badge de riesgo */}
              <span
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  nivel === 'alto' || nivel === 'critico'
                    ? 'bg-red-50 text-red-500'
                    : nivel === 'medio'
                    ? 'bg-amber-50 text-amber-500'
                    : 'bg-blue-50 text-primary'
                }`}
                aria-hidden="true"
              >
                💊
              </span>

              {/* Texto */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate leading-tight">
                  <HighlightMatch text={nombre} query={query} />
                </p>
                {principios && (
                  <p className="text-xs text-slate-400 truncate leading-tight mt-0.5">
                    {principios}
                  </p>
                )}
              </div>

              {/* Badge nivel de riesgo */}
              {med.riesgo_nivel && (
                <span
                  className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    nivel === 'alto' || nivel === 'critico'
                      ? 'bg-red-50 text-red-600'
                      : nivel === 'medio'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {med.riesgo_nivel}
                </span>
              )}

              {/* Flecha indicadora cuando activo */}
              {isActive && (
                <span className="shrink-0 text-primary text-xs" aria-hidden="true">↵</span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      {!isLoading && suggestions.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/80">
          <span className="text-[11px] text-slate-400">
            ↑↓ para navegar · Enter para seleccionar · Esc para cerrar
          </span>
        </div>
      )}
    </div>
  );
}

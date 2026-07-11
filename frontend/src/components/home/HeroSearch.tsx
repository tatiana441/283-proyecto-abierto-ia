import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOME } from '../../constants/copy';
import { buscarMedicamentos, type ApiMedicamento } from '../../lib/api';
import SearchSuggestions from './SearchSuggestions';

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ApiMedicamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Cerrar el dropdown al hacer click fuera ──────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Debounce de búsqueda ─────────────────────────────────────────────────
  useEffect(() => {
    const q = query.trim();

    if (q.length < MIN_CHARS) {
      setSuggestions([]);
      setShowDropdown(false);
      setActiveIndex(-1);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    setIsLoading(true);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await buscarMedicamentos(q, 8);
        setSuggestions(results);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // ── Navegar a un medicamento seleccionado ────────────────────────────────
  const handleSelectSuggestion = useCallback((med: ApiMedicamento) => {
    setShowDropdown(false);
    setActiveIndex(-1);
    setSuggestions([]);
    setQuery(med.producto ?? '');
    navigate(`/medicamento/${med.expediente}`);
  }, [navigate]);

  // ── Enviar formulario (búsqueda por texto libre) ─────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Si hay una sugerencia activa, usarla
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelectSuggestion(suggestions[activeIndex]);
      return;
    }
    const q = query.trim();
    if (!q) return;
    setShowDropdown(false);
    navigate(`/medicamento/${encodeURIComponent(q.toLowerCase())}`);
  };

  // ── Navegación con teclado ───────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setShowDropdown(false);
        setActiveIndex(-1);
        break;
    }
  };

  // ── Click en tag rápido ──────────────────────────────────────────────────
  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setShowDropdown(false);
    navigate(`/medicamento/${encodeURIComponent(tag.toLowerCase())}`);
  };

  const dropdownVisible = showDropdown && query.trim().length >= MIN_CHARS;
  const activeDescendant =
    activeIndex >= 0 && suggestions[activeIndex]
      ? `suggestion-${suggestions[activeIndex].expediente}`
      : undefined;

  return (
    <section id="buscar" className="relative py-20" aria-label="Búsqueda de medicamentos">
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 text-center">

        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.03em] leading-[1.15] mb-5 max-w-[780px] mx-auto text-blue-950">
          {HOME.heroTitle}
          <span className="block text-primary">{HOME.spanTitle}</span>
        </h1>
        <p className="text-lg mb-10 max-w-[560px] mx-auto leading-relaxed text-slate-500">
          {HOME.heroSubtitle}
        </p>

        {/* Search form */}
        <div className="max-w-[680px] mx-auto">
          {/* Contenedor relativo para posicionar el dropdown */}
          <div ref={containerRef} className="relative">
            <form
              className="flex items-center bg-white rounded-full py-2 pr-2 pl-6 gap-2 shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-slate-200 focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.15)] focus-within:border-primary transition-all duration-250"
              onSubmit={handleSearch}
              role="search"
              aria-label="Buscar medicamentos"
            >
              <span className="text-xl shrink-0 text-slate-400" aria-hidden="true">🔍</span>
              <label htmlFor="med-search" className="sr-only">{HOME.searchPlaceholder}</label>
              <input
                ref={inputRef}
                id="med-search"
                type="search"
                role="combobox"
                aria-expanded={dropdownVisible}
                aria-controls="med-search-listbox"
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                aria-haspopup="listbox"
                className="flex-1 border-none outline-none text-base text-slate-900 bg-transparent min-w-0 py-2 placeholder:text-slate-400"
                placeholder={HOME.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (query.trim().length >= MIN_CHARS && suggestions.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="submit"
                className="shrink-0 bg-linear-to-br from-primary to-primary-light text-white font-semibold text-sm px-6 py-3 rounded-full cursor-pointer transition-all duration-150 hover:-translate-y-px hover:shadow-primary active:translate-y-0 whitespace-nowrap"
                aria-label="Buscar medicamento"
              >
                {HOME.searchButton}
              </button>
            </form>

            {/* Dropdown de sugerencias */}
            {dropdownVisible && (
              <div id="med-search-listbox">
                <SearchSuggestions
                  suggestions={suggestions}
                  activeIndex={activeIndex}
                  onSelect={handleSelectSuggestion}
                  isLoading={isLoading}
                  query={query.trim()}
                />
              </div>
            )}
          </div>

          {/* Quick tags */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-5" role="group" aria-label="Búsquedas frecuentes">
            <span className="text-sm font-medium text-[rgba(34,39,44,0.7)]">{HOME.exampleLabel}</span>
            {HOME.exampleTags.map(tag => (
              <button
                key={tag}
                type="button"
                className="inline-flex items-center bg-primary/10 border border-[rgba(85,76,76,0.3)] text-[rgb(90,92,131)] text-sm font-medium py-1 px-4 rounded-full cursor-pointer transition-all duration-150 hover:bg-[rgba(202,193,242,0.25)] hover:-translate-y-px backdrop-blur-sm"
                onClick={() => handleTagClick(tag)}
                aria-label={`Buscar ${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

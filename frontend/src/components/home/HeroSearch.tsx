import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOME } from '../../constants/copy';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/medicamento/${encodeURIComponent(q.toLowerCase())}`);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    navigate(`/medicamento/${encodeURIComponent(tag.toLowerCase())}`);
  };

  return (
    <section id="buscar" className="relative overflow-hidden py-20" aria-label="Búsqueda de medicamentos">
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
          <form
            className="flex items-center bg-white rounded-full py-2 pr-2 pl-6 gap-2 shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-slate-200 focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.15)] focus-within:border-primary transition-all duration-250"
            onSubmit={handleSearch}
            role="search"
            aria-label="Buscar medicamentos"
          >
            <span className="text-xl shrink-0 text-slate-400" aria-hidden="true">🔍</span>
            <label htmlFor="med-search" className="sr-only">{HOME.searchPlaceholder}</label>
            <input
              id="med-search"
              type="search"
              className="flex-1 border-none outline-none text-base text-slate-900 bg-transparent min-w-0 py-2 placeholder:text-slate-400"
              placeholder={HOME.searchPlaceholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
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

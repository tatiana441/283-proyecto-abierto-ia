import { Link } from 'react-router-dom';
import { LANDING_HERO } from '../../constants/copy';

interface LandingHeroProps {
  onScrollToHowItWorks: () => void;
}

export default function LandingHero({ onScrollToHowItWorks }: LandingHeroProps) {
  return (
    <section className="pt-28 pb-20 overflow-hidden" aria-label="Introducción a MediWatch">
      <div className="container max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="text-left flex flex-col items-start">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50/70 border border-blue-100 rounded-full px-4 py-2 text-[13px] font-semibold text-[#005cbf] mb-6 cursor-default">
              {/* Shield check SVG */}
              <svg className="w-4 h-4 text-[#005cbf] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {LANDING_HERO.badge}
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#111827] tracking-tight leading-[1.12] mb-6">
              {LANDING_HERO.titlePrefix}
              <span className="text-[#005cbf]">{LANDING_HERO.titleHighlight}</span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-8 max-w-[540px] font-normal">
              {LANDING_HERO.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-[#005cbf] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-6 py-4 rounded-2xl cursor-pointer transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-lg hover:-translate-y-px active:translate-y-0 no-underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                </svg>
                {LANDING_HERO.ctaPrimary}
              </Link>
              <button
                onClick={onScrollToHowItWorks}
                className="inline-flex items-center gap-1.5 bg-[#ebf3fc] hover:bg-blue-100 text-[#005cbf] font-bold text-sm px-6 py-4 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-px active:translate-y-0"
              >
                {LANDING_HERO.ctaSecondary}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

          </div>

          {/* Right Column: Illustration */}
          <div className="flex items-center justify-center relative">
            {/* Decorative soft glow behind illustration */}
            <div className="absolute w-[360px] h-[360px] bg-blue-100/50 rounded-full blur-3xl z-0 pointer-events-none" />
            
            <img
              src="/hero_illustration.webp"
              alt={LANDING_HERO.illustrationAlt}
              width={480}
              height={480}
              className="relative z-10 w-full max-w-[460px] drop-shadow-2xl animate-[fade-in_0.5s_ease]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

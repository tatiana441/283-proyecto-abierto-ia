import { HOW_IT_WORKS, LANDING_FEATURES, LANDING_STATS } from '../constants/copy';
import LandingHero from '../components/home/LandingHero';
import HowItWorksCards from '../components/home/HowItWorksCards';
import LandingStats from '../components/home/LandingStats';
import LandingFeatures from '../components/home/LandingFeatures';
import LandingDemo from '../components/home/LandingDemo';
import LandingPersonas from '../components/home/LandingPersonas';
import LandingTrust from '../components/home/LandingTrust';

export default function LandingPage() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <LandingHero onScrollToHowItWorks={() => handleScroll('como-funciona')} />

      {/* Section: Cómo Funciona */}
      <section id="como-funciona" className="py-20 bg-[#f6f9fd]" aria-label="Cómo funciona">
        <div className="container max-w-[1000px] mx-auto px-4 text-center">
          <p className="text-xs font-bold text-[#005cbf] uppercase tracking-widest mb-2">
            {HOW_IT_WORKS.badge}
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {HOW_IT_WORKS.title}
          </h2>
          <p className="text-slate-500 max-w-[540px] mx-auto text-base md:text-[17px] mb-12 leading-relaxed">
            {HOW_IT_WORKS.subtitle}
          </p>

          <HowItWorksCards steps={HOW_IT_WORKS.steps} />
        </div>
      </section>

      {/* Section: Estadísticas de Impacto */}
      <LandingStats {...LANDING_STATS} />

      {/* Section: Funcionalidades */}
      <LandingFeatures {...LANDING_FEATURES} />

      {/* Section: Demo de medicamento */}
      <LandingDemo />

      {/* Section: Para quién es MediWatch */}
      <LandingPersonas />

      {/* Section: Confianza y transparencia */}
      <LandingTrust />
    </div>
  );
}

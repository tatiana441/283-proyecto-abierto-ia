import FeatureCard, { type FeatureCardData } from '../shared/FeatureCard';

interface LandingFeaturesProps {
  badge: string;
  title: string;
  subtitle: string;
  items: FeatureCardData[];
}

export default function LandingFeatures({ badge, title, subtitle, items }: LandingFeaturesProps) {
  return (
    <section id="funcionalidades" className="py-20 bg-white" aria-label="Funcionalidades principales">
      <div className="container max-w-[1100px] mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#005cbf] uppercase tracking-widest mb-3">
            {badge}
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 max-w-[520px] mx-auto text-base md:text-[17px] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 3×2 Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <FeatureCard key={item.id} data={item} />
          ))}
        </div>

      </div>
    </section>
  );
}

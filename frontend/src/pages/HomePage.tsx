import HeroSearch from '../components/home/HeroSearch';
import QuickActionCards from '../components/home/QuickActionCards';
import RiskAndPricingOverview from '../components/home/RiskAndPricingOverview';

export default function HomePage() {
  return (
    <main id="main-content" aria-label="Inicio — MediAlerta Colombia">
      <HeroSearch />
      <QuickActionCards />
      <RiskAndPricingOverview />
    </main>
  );
}

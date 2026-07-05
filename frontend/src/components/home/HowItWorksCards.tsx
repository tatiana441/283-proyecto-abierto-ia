export interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
  iconType: 'search' | 'analyze' | 'info' | string;
}

interface HowItWorksCardsProps {
  steps: HowItWorksStep[];
}

export default function HowItWorksCards({ steps }: HowItWorksCardsProps) {
  // Helper to render the appropriate icon and background styles based on iconType
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'search':
        return (
          <div className="w-14 h-14 bg-blue-50/60 border border-blue-100 rounded-full flex items-center justify-center mb-5 shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </div>
        );
      case 'analyze':
        return (
          <div className="w-14 h-14 bg-emerald-50/60 border border-emerald-100 rounded-full flex items-center justify-center mb-5 shrink-0">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17h3v4H3v-4zm6-5h3v9H9v-9zm6-5h3v14h-3V7zm6-4h3v18h-3V3z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-14 h-14 bg-teal-50/60 border border-teal-100 rounded-full flex items-center justify-center mb-5 shrink-0">
            <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a7.5 7.5 0 0 1-7.5-7.5c0-4.5 7.5-11.5 7.5-11.5s7.5 7 7.5 11.5A7.5 7.5 0 0 1 12 21z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 3.5h.01" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {steps.map((step) => (
        <div
          key={step.id}
          className="bg-white border border-slate-200/80 rounded-[28px] p-8 flex flex-col items-center text-center shadow-xs hover:scale-105 transition-transform duration-200"
        >
          <span className="text-[54px] font-extrabold text-blue-100/60 leading-none mb-3 cursor-default">
            {step.id}
          </span>
          {renderIcon(step.iconType)}
          <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-[220px] mx-auto font-normal">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}

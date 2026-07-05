import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string;
  medCount: number;
  status: 'Disponible' | 'Monitoreo' | 'Alto riesgo';
  statusColor: 'low' | 'monitor' | 'high';
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
}

export default function CategoriesPage() {
  const categories: Category[] = [
    {
      id: 'cardiovascular',
      name: 'Cardiovascular',
      description: 'Antihipertensivos, anticoagulantes, estatinas',
      medCount: 312,
      status: 'Disponible',
      statusColor: 'low',
      bgColor: 'bg-rose-50/70 border-rose-100',
      iconColor: 'text-rose-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )
    },
    {
      id: 'diabetes',
      name: 'Diabetes',
      description: 'Insulinas, antidiabéticos orales, incretinas',
      medCount: 148,
      status: 'Monitoreo',
      statusColor: 'monitor',
      bgColor: 'bg-amber-50/70 border-amber-100',
      iconColor: 'text-amber-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-9 6 18 3-9h3" />
        </svg>
      )
    },
    {
      id: 'neurologia',
      name: 'Neurología / Psiquiatría',
      description: 'Antidepresivos, anticonvulsivos, ansiolíticos',
      medCount: 241,
      status: 'Monitoreo',
      statusColor: 'monitor',
      bgColor: 'bg-indigo-50/70 border-indigo-100',
      iconColor: 'text-indigo-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 0 0 12 17.75h.007a3 3 0 0 0 2.464-1.63L16 13h-2.5v-1.5h3L17 10h-3.5V8.5h4L18 7H6v3l2.5 1.5H5v1.5h3.5L9 15h-.47A3 3 0 0 0 9.53 16.122Z" />
        </svg>
      )
    },
    {
      id: 'infectologia',
      name: 'Infectología',
      description: 'Antibióticos, antivirales, antifúngicos',
      medCount: 289,
      status: 'Disponible',
      statusColor: 'low',
      bgColor: 'bg-green-50/70 border-green-100',
      iconColor: 'text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    },
    {
      id: 'gastroenterologia',
      name: 'Gastroenterología',
      description: 'Antiácidos, IBPs, procinéticos',
      medCount: 178,
      status: 'Disponible',
      statusColor: 'low',
      bgColor: 'bg-teal-50/70 border-teal-100',
      iconColor: 'text-teal-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747C20.93 11.75 19 8.25 12 3c-7 5.25-8.93 8.75-8.716 11.253A9.004 9.004 0 0 0 12 21Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
        </svg>
      )
    },
    {
      id: 'oncologia',
      name: 'Oncología',
      description: 'Antineoplásicos, inmunoterapia, hormonoterapia',
      medCount: 94,
      status: 'Alto riesgo',
      statusColor: 'high',
      bgColor: 'bg-red-50/70 border-red-100',
      iconColor: 'text-red-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      )
    },
    {
      id: 'reumatologia',
      name: 'Reumatología',
      description: 'DMARD, biológicos, antiinflamatorios',
      medCount: 112,
      status: 'Alto riesgo',
      statusColor: 'high',
      bgColor: 'bg-blue-50/70 border-blue-100',
      iconColor: 'text-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'oftalmologia',
      name: 'Oftalmología',
      description: 'Gotas, lubricantes, antiglaucoma',
      medCount: 67,
      status: 'Disponible',
      statusColor: 'low',
      bgColor: 'bg-sky-50/70 border-sky-100',
      iconColor: 'text-sky-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      )
    },
    {
      id: 'pediatria',
      name: 'Pediatría',
      description: 'Medicamentos pediátricos y formulaciones infantiles',
      medCount: 203,
      status: 'Disponible',
      statusColor: 'low',
      bgColor: 'bg-pink-50/70 border-pink-100',
      iconColor: 'text-pink-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M12 18.75c-5.385 0-9.75-4.365-9.75-9.75s4.365-9.75 9.75-9.75 9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75zM10 10.5h.008m3.984 0h.008" />
        </svg>
      )
    },
    {
      id: 'respiratorio',
      name: 'Respiratorio',
      description: 'Broncodilatadores, corticoides inhalados, antitusivos',
      medCount: 156,
      status: 'Monitoreo',
      statusColor: 'monitor',
      bgColor: 'bg-emerald-50/70 border-emerald-100',
      iconColor: 'text-emerald-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h2.25a2.25 2.25 0 001.913-1.072L9 7.5l3 9 3-12 1.837 5.51A2.25 2.25 0 0018.75 12H21" />
        </svg>
      )
    }
  ];

  const badgeCls = (color: string) => {
    switch (color) {
      case 'low':
        return 'bg-low-bg text-low-text';
      case 'monitor':
        return 'bg-monitor-bg text-monitor-text';
      case 'high':
        return 'bg-high-bg text-high-text';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <main id="main-content" className="py-8 pb-16">
      <div className="container max-w-4xl pt-5">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer no-underline text-slate-600"
            aria-label="Volver al inicio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">
              Categorías Terapéuticas
            </h1>
            <p className="text-sm md:text-base text-slate-500">
              Explorar medicamentos por área médica
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categorias/${cat.id}`}
              className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[24px] hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer no-underline group"
            >
              <div className="flex items-center gap-4">
                {/* Circular Icon Wrapper */}
                <div className={`w-[52px] h-[52px] rounded-[18px] flex items-center justify-center shrink-0 border border-transparent ${cat.bgColor} ${cat.iconColor}`}>
                  {cat.icon}
                </div>

                {/* Details */}
                <div className="text-left">
                  <h2 className="text-base font-bold text-slate-900 leading-snug tracking-tight mb-1 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 leading-normal max-w-[280px] mb-2 font-normal line-clamp-1">
                    {cat.description}
                  </p>
                  
                  {/* Footer metadata */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium text-slate-400">
                      {cat.medCount} medicamentos
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${badgeCls(cat.statusColor)}`}>
                      {cat.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="text-slate-300 group-hover:text-primary transition-colors pr-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}

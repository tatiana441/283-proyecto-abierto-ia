import { useParams, Link } from 'react-router-dom';

interface MedItem {
  name: string;
  activeIngredient: string;
  risk: 'Disponible' | 'Monitoreo' | 'Alto riesgo';
  riskColor: 'low' | 'monitor' | 'high';
  price: string;
  slug: string;
}

interface CategoryDetail {
  name: string;
  description: string;
  meds: MedItem[];
}

const CATEGORY_DATA: Record<string, CategoryDetail> = {
  cardiovascular: {
    name: 'Cardiovascular',
    description: 'Antihipertensivos, anticoagulantes, estatinas',
    meds: [
      { name: 'Losartán Potásico 50mg', activeIngredient: 'Losartán', risk: 'Monitoreo', riskColor: 'monitor', price: '$18.500 COP', slug: 'losartán' },
      { name: 'Atorvastatina Cálcica 20mg', activeIngredient: 'Atorvastatina', risk: 'Disponible', riskColor: 'low', price: '$24.200 COP', slug: 'losartán' },
      { name: 'Amlodipino Besilato 5mg', activeIngredient: 'Amlodipino', risk: 'Disponible', riskColor: 'low', price: '$9.500 COP', slug: 'losartán' },
    ]
  },
  diabetes: {
    name: 'Diabetes',
    description: 'Insulinas, antidiabéticos orales, incretinas',
    meds: [
      { name: 'Metformina Clorhidrato 850mg', activeIngredient: 'Metformina', risk: 'Disponible', riskColor: 'low', price: '$6.800 COP', slug: 'metformina' },
      { name: 'Insulina Glargina 100 UI/mL', activeIngredient: 'Insulina glargina', risk: 'Alto riesgo', riskColor: 'high', price: '$185.000 COP', slug: 'insulina' },
      { name: 'Sitagliptina Fosfato 100mg', activeIngredient: 'Sitagliptina', risk: 'Monitoreo', riskColor: 'monitor', price: '$45.000 COP', slug: 'metformina' },
    ]
  },
  neurologia: {
    name: 'Neurología / Psiquiatría',
    description: 'Antidepresivos, anticonvulsivos, ansiolíticos',
    meds: [
      { name: 'Fluoxetina Clorhidrato 20mg', activeIngredient: 'Fluoxetina', risk: 'Monitoreo', riskColor: 'monitor', price: '$15.400 COP', slug: 'losartán' },
      { name: 'Sertralina Clorhidrato 50mg', activeIngredient: 'Sertralina', risk: 'Disponible', riskColor: 'low', price: '$22.100 COP', slug: 'losartán' },
      { name: 'Clonazepam 2mg', activeIngredient: 'Clonazepam', risk: 'Monitoreo', riskColor: 'monitor', price: '$8.900 COP', slug: 'losartán' },
    ]
  },
  infectologia: {
    name: 'Infectología',
    description: 'Antibióticos, antivirales, antifúngicos',
    meds: [
      { name: 'Amoxicilina 500mg (Caja x 10)', activeIngredient: 'Amoxicilina', risk: 'Disponible', riskColor: 'low', price: '$12.800 COP', slug: 'losartán' },
      { name: 'Azitromicina 500mg', activeIngredient: 'Azitromicina', risk: 'Disponible', riskColor: 'low', price: '$16.500 COP', slug: 'losartán' },
      { name: 'Ciprofloxacino 500mg', activeIngredient: 'Ciprofloxacino', risk: 'Disponible', riskColor: 'low', price: '$14.200 COP', slug: 'losartán' },
    ]
  },
  gastroenterologia: {
    name: 'Gastroenterología',
    description: 'Antiácidos, IBPs, procinéticos',
    meds: [
      { name: 'Omeprazol 20mg (Caja x 10)', activeIngredient: 'Omeprazol', risk: 'Disponible', riskColor: 'low', price: '$5.900 COP', slug: 'losartán' },
      { name: 'Esomeprazol 40mg', activeIngredient: 'Esomeprazol', risk: 'Disponible', riskColor: 'low', price: '$19.800 COP', slug: 'losartán' },
      { name: 'Domperidona 10mg', activeIngredient: 'Domperidona', risk: 'Disponible', riskColor: 'low', price: '$7.200 COP', slug: 'losartán' },
    ]
  },
  oncologia: {
    name: 'Oncología',
    description: 'Antineoplásicos, inmunoterapia, hormonoterapia',
    meds: [
      { name: 'Trastuzumab 440mg', activeIngredient: 'Trastuzumab', risk: 'Alto riesgo', riskColor: 'high', price: '$1.850.000 COP', slug: 'losartán' },
      { name: 'Tamoxifeno 20mg', activeIngredient: 'Tamoxifeno Citrato', risk: 'Monitoreo', riskColor: 'monitor', price: '$32.400 COP', slug: 'losartán' },
    ]
  },
  reumatologia: {
    name: 'Reumatología',
    description: 'DMARD, biológicos, antiinflamatorios',
    meds: [
      { name: 'Metotrexato 2.5mg', activeIngredient: 'Metotrexato', risk: 'Alto riesgo', riskColor: 'high', price: '$45.600 COP', slug: 'losartán' },
      { name: 'Adalimumab 40mg/0.8mL', activeIngredient: 'Adalimumab', risk: 'Alto riesgo', riskColor: 'high', price: '$2.450.000 COP', slug: 'losartán' },
    ]
  },
  oftalmologia: {
    name: 'Oftalmología',
    description: 'Gotas, lubricantes, antiglaucoma',
    meds: [
      { name: 'Latanoprost Solución 0.005%', activeIngredient: 'Latanoprost', risk: 'Disponible', riskColor: 'low', price: '$48.900 COP', slug: 'losartán' },
      { name: 'Carboximetilcelulosa 0.5%', activeIngredient: 'Carboximetilcelulosa sódica', risk: 'Disponible', riskColor: 'low', price: '$15.500 COP', slug: 'losartán' },
    ]
  },
  pediatria: {
    name: 'Pediatría',
    description: 'Medicamentos pediátricos y formulaciones infantiles',
    meds: [
      { name: 'Acetaminofén Jarabe 150mg/5mL', activeIngredient: 'Acetaminofén', risk: 'Disponible', riskColor: 'low', price: '$4.500 COP', slug: 'losartán' },
      { name: 'Amoxicilina Suspensión 250mg/5mL', activeIngredient: 'Amoxicilina', risk: 'Disponible', riskColor: 'low', price: '$8.900 COP', slug: 'losartán' },
    ]
  },
  respiratorio: {
    name: 'Respiratorio',
    description: 'Broncodilatadores, corticoides inhalados, antitusivos',
    meds: [
      { name: 'Salbutamol Inhalador 100mcg', activeIngredient: 'Salbutamol', risk: 'Monitoreo', riskColor: 'monitor', price: '$18.900 COP', slug: 'losartán' },
      { name: 'Budesonida Inhalador 200mcg', activeIngredient: 'Budesonida', risk: 'Disponible', riskColor: 'low', price: '$34.200 COP', slug: 'losartán' },
    ]
  }
};

export default function CategoryDetailPage() {
  const { categoryId = '' } = useParams<{ categoryId: string }>();
  const category = CATEGORY_DATA[categoryId.toLowerCase()];

  if (!category) {
    return (
      <main id="main-content">
        <div className="container">
          <div className="text-center py-20 px-6">
            <div className="text-[64px] mb-4" aria-hidden="true">📋</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Categoría no encontrada</h1>
            <p className="text-slate-500 mb-6">
              No encontramos la categoría solicitada.
            </p>
            <Link
              to="/categorias"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-base px-6 py-3 rounded-lg no-underline transition-all duration-150 hover:bg-primary-dark hover:-translate-y-px cursor-pointer"
            >
              ← Volver a categorías
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const badgeCls = (color: string) => {
    switch (color) {
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200/60';
      case 'monitor':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200/60';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/60';
    }
  };

  return (
    <main id="main-content" className="py-8 pb-16">
      <div className="container max-w-4xl pt-5">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
          <Link to="/" className="text-primary font-medium hover:underline cursor-pointer">Inicio</Link>
          <span aria-hidden="true" className="text-slate-400">›</span>
          <Link to="/categorias" className="text-primary font-medium hover:underline cursor-pointer">Categorías</Link>
          <span aria-hidden="true" className="text-slate-400">›</span>
          <span aria-current="page" className="text-slate-400">{category.name}</span>
        </nav>

        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/categorias"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer no-underline text-slate-600"
            aria-label="Volver a categorías"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">
              {category.name}
            </h1>
            <p className="text-sm md:text-base text-slate-500">
              {category.description}
            </p>
          </div>
        </div>

        {/* Medications List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {category.meds.map((med, index) => (
            <Link
              key={index}
              to={`/medicamento/${med.slug}`}
              className="flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-[20px] hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer no-underline group text-left"
            >
              <div>
                {/* Header: Name and Status */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug tracking-tight group-hover:text-primary transition-colors">
                    {med.name}
                  </h2>
                </div>

                {/* Subtitle / Active ingredient */}
                <p className="text-xs md:text-sm text-slate-500 mb-4 font-normal">
                  Principio activo: <span className="font-semibold text-slate-700">{med.activeIngredient}</span>
                </p>

                {/* Status Badge */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeCls(med.riskColor)} mb-6`}>
                  {med.risk}
                </span>
              </div>

              {/* Footer: Price and CTA */}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Precio promedio
                  </p>
                  <p className="text-base font-extrabold text-[#005cbf]">
                    {med.price}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                  Ver ficha
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}

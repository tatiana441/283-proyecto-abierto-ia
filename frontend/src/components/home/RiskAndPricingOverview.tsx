import { Link } from 'react-router-dom';

export default function RiskAndPricingOverview() {
  return (
    <section className="py-16 bg-white" aria-label="Resumen de riesgo y precios de referencia">
      <div className="container">
        {/* Outer Section Box */}
        <div className="p-6 md:p-8 lg:p-10">
          
          {/* Main Title */}
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
            Análisis de Riesgo y Precios de Referencia
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Card: Risk */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">
                  Alto Riesgo de Desabastecimiento
                </h3>
                <p className="text-xs md:text-sm text-slate-500 mb-6">
                  Cronología de Abastecimiento actualizada hoy.
                </p>
              </div>

              <div>
                <hr className="border-slate-100 mb-4" />
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm font-medium text-slate-700">
                    Alternativas Recomendadas
                  </span>
                  <Link 
                    to="/alertas" 
                    className="text-xs md:text-sm font-bold text-[#005cbf] hover:text-blue-700 hover:underline transition-colors no-underline cursor-pointer"
                  >
                    Ver lista
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Card: Reference Prices */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-5">
                Precios de Referencia
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* Item 1 */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs md:text-sm text-slate-700 font-medium">
                    Acetaminofén 500mg (Caja x 10)
                  </span>
                  <span className="text-xs md:text-sm font-bold text-[#005cbf]">
                    $4.500 COP
                  </span>
                </div>

                {/* Item 2 */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs md:text-sm text-slate-700 font-medium">
                    Amoxicilina 500mg (Caja x 10)
                  </span>
                  <span className="text-xs md:text-sm font-bold text-[#005cbf]">
                    $12.800 COP
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

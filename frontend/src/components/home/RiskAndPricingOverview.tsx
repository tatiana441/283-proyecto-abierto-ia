import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { topRiesgo, type ApiRiesgo } from '../../lib/api';

const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

export default function RiskAndPricingOverview() {
  const [top, setTop] = useState<ApiRiesgo[]>([]);

  useEffect(() => {
    topRiesgo(3)
      .then((filas) => setTop(filas.slice(0, 3)))
      .catch(() => { /* sin datos: la tarjeta muestra solo el enlace */ });
  }, []);

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

            {/* Left Card: top riesgo EN VIVO */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">
                  Alto Riesgo de Desabastecimiento
                </h3>
                <p className="text-xs md:text-sm text-slate-500 mb-4">
                  Los principios activos con mayor score ahora mismo, según datos oficiales.
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  {top.map((r) => (
                    <div key={r.principio_activo} className="flex justify-between items-center py-1">
                      <span className="text-xs md:text-sm text-slate-700 font-medium truncate pr-3">
                        {titleCase(r.principio_activo)}
                      </span>
                      <span className="text-xs md:text-sm font-bold text-high shrink-0">
                        {r.score.toLocaleString('es-CO')} / 100
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <hr className="border-slate-100 mb-4" />
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm font-medium text-slate-700">
                    Lista completa con predicción IA
                  </span>
                  <Link
                    to="/alto-riesgo"
                    className="text-xs md:text-sm font-bold text-[#005cbf] hover:text-blue-700 hover:underline transition-colors no-underline cursor-pointer"
                  >
                    Ver lista
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Card: fuentes de precios (sin cifras inventadas) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-5">
                  Precios de Referencia
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center py-1 gap-3">
                    <span className="text-xs md:text-sm text-slate-700 font-medium">
                      Referencia por unidad — Termómetro Clicsalud
                    </span>
                    <span className="text-xs md:text-sm font-bold text-[#005cbf] shrink-0">oct 2024</span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-3">
                    <span className="text-xs md:text-sm text-slate-700 font-medium">
                      Techo legal — Circular 19 (CNPMDM)
                    </span>
                    <span className="text-xs md:text-sm font-bold text-[#005cbf] shrink-0">vigente</span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-3">
                    <span className="text-xs md:text-sm text-slate-700 font-medium">
                      Histórico reportado — SISMED
                    </span>
                    <span className="text-xs md:text-sm font-bold text-[#005cbf] shrink-0">2017-2019</span>
                  </div>
                </div>
              </div>

              <div>
                <hr className="border-slate-100 mb-4 mt-4" />
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm font-medium text-slate-700">
                    Consúltalos en cada medicamento
                  </span>
                  <Link
                    to="/dashboard#buscar"
                    className="text-xs md:text-sm font-bold text-[#005cbf] hover:text-blue-700 hover:underline transition-colors no-underline cursor-pointer"
                  >
                    Buscar
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

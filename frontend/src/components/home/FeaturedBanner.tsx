export default function FeaturedBanner() {
  return (
    <section className="py-16" aria-label="Monitoreo de riesgo con IA">
      <div className="container">
        <div
          className="relative overflow-hidden rounded-[32px] p-8 md:p-12 lg:p-16 bg-no-repeat bg-cover "
          style={{ backgroundImage: `url('/medical_bg.webp')` }}
        >
          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-slate-950/45 z-0" />

          {/* Content Wrapper */}
          <div className="relative z-10 max-w-[620px] text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-semibold text-blue-200 tracking-wider uppercase mb-6">
              {/* Custom SVG Head/Brain Outline Icon */}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75v1.5a4.5 4.5 0 004.5 4.5H8.25a2.25 2.25 0 012.25 2.25v1.5a1.5 1.5 0 001.5 1.5h.007a1.5 1.5 0 001.5-1.5v-1.5a2.25 2.25 0 012.25-2.25H17.25a4.5 4.5 0 004.5-4.5v-1.5c0-5.385-4.365-9.75-9.75-9.75z" />
                <circle cx="12" cy="11.5" r="1.5" fill="currentColor" />
              </svg>
              IA Avanzada
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-[40px] font-bold text-white tracking-tight leading-[1.12] mb-5">
              Monitoreo de riesgo de medicamentos con IA para Colombia
            </h2>

            {/* Description */}
            <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed mb-8 max-w-[540px]">
              Analizamos las solicitudes de importación de urgencia ante INVIMA para anticipar el desabastecimiento de medicamentos, con un modelo validado sobre datos abiertos. Ciencia de datos al servicio de la vida.
            </p>

            {/* Button */}
            <div>
              <a
                href="/alto-riesgo"
                className="inline-flex items-center gap-2 bg-[#005cbf] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm px-6 py-3.5 rounded-full no-underline transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
              >
                Conocer más sobre el sistema
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

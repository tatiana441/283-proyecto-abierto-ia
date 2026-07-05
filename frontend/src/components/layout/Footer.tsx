export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-8 text-center" role="contentinfo">
      <div className="container px-4">
        {/* First Line: Brand / Source */}
        <div className="flex items-center justify-center gap-1 text-slate-500 font-semibold text-sm md:text-[15px] mb-2">
            <img src="/icono.svg" alt="MediWatch Icon" width="30" height="30"/>
          <span>MediWatch Colombia · Datos INVIMA · Ministerio de Salud</span>
        </div>

        {/* Second Line: Disclaimer */}
        <p className="text-xs md:text-sm text-slate-400">
          La información es orientativa. Consulte siempre a su médico o farmacéutico.
        </p>
      </div>
    </footer>
  );
}

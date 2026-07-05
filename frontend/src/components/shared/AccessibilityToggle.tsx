import { useEffect, useState } from 'react';
import { FiType } from 'react-icons/fi';

/**
 * AccessibilityToggle
 * Allows users (especially elderly) to toggle between normal and large text size globally.
 * Persists the preference in localStorage and toggles the root 'accessibility-large-text' class.
 */
export default function AccessibilityToggle() {
  const [isLarge, setIsLarge] = useState(() => {
    return localStorage.getItem('largeText') === 'true';
  });

  useEffect(() => {
    if (isLarge) {
      document.documentElement.classList.add('accessibility-large-text');
      localStorage.setItem('largeText', 'true');
    } else {
      document.documentElement.classList.remove('accessibility-large-text');
      localStorage.setItem('largeText', 'false');
    }
  }, [isLarge]);

  return (
    <button
      onClick={() => setIsLarge(prev => !prev)}
      title="Cambiar tamaño de letra (Accesibilidad)"
      aria-label={isLarge ? "Cambiar a tamaño de letra normal" : "Aumentar tamaño de letra para personas mayores"}
      className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
    >
      <FiType size={18} strokeWidth={2.5} className="text-slate-600" />
      <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
        {isLarge ? 'A-' : 'A+'}
      </span>
    </button>
  );
}

import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

/**
 * ScrollToTopButton
 * Appears when the user scrolls past 25% of the total page height.
 * Clicking it smoothly scrolls back to the very top.
 * Placed globally in App.tsx so it works on every page.
 */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past 25% of the total scrollable height
      const scrolled = window.scrollY;
      const threshold = (document.documentElement.scrollHeight - window.innerHeight) * 0.25;
      setVisible(scrolled > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Volver al inicio de la página"
      className={`
        fixed bottom-6 right-6 z-50
        w-11 h-11 rounded-full
        bg-[#005cbf] hover:bg-blue-700 active:bg-blue-800
        text-white shadow-lg hover:shadow-xl
        flex items-center justify-center
        cursor-pointer
        transition-all duration-300
        hover:-translate-y-0.5 active:translate-y-0
        ${visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      <FiArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
}

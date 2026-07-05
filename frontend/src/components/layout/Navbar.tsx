import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV, APP_NAME } from '../../constants/copy';
import { useAuth } from '../../lib/auth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn, signOut: supabaseSignOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const signOut = async (_opts?: { redirectUrl?: string }) => {
    await supabaseSignOut();
    navigate('/');
  };
  const navRef = useRef<HTMLElement>(null);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;

    const handleScroll = () => setMenuOpen(false);
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const linkCls = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold no-underline transition-all duration-150 whitespace-nowrap cursor-pointer ${
      isActive(path)
        ? 'text-primary bg-primary-bg'
        : 'text-slate-500 hover:text-primary hover:bg-primary-bg'
    }`;

  const handleLandingScroll = (id: string) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const isLoginOrSignUpPath = location.pathname === '/login' || location.pathname === '/sign-up';

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-1000 transition-shadow duration-250 shadow-nav"
      role="banner"
    >
      <nav
        ref={navRef}
        className="flex justify-between items-center h-full px-4 md:px-6 max-w-5xl mx-auto"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          to={isSignedIn ? "/dashboard" : "/"}
          className="flex items-center no-underline font-bold shrink-0 gap-1.5 cursor-pointer"
          aria-label={NAV.logoAlt}
        >
          <img src="/Logo2.webp" alt="Logo" width={50} height={50} />
          <p className="text-2xl text-blue-900"><span className="text-blue-500">Medi</span>Watch</p>
        </Link>

        {/* Navigation links */}
        {!isLoginOrSignUpPath && (
          <ul
            id="nav-menu"
            role="list"
            className={`list-none gap-2 items-center z-50 md:flex md:flex-row md:static md:shadow-none md:p-0 md:bg-transparent md:border-none md:top-auto
              ${menuOpen
                ? 'flex flex-col fixed top-16 left-0 right-0 bg-white border-b border-slate-200 p-4 shadow-lg'
                : 'hidden'
              }`}
          >
            {!isSignedIn ? (
              // Landing Page Navbar links
              <>
                <li>
                  <button
                    onClick={() => handleLandingScroll('como-funciona')}
                    className="w-full text-left md:text-center text-sm font-semibold text-slate-500 hover:text-[#005cbf] hover:bg-slate-50 md:hover:bg-transparent transition-all duration-150 cursor-pointer py-2 px-3 rounded-lg border-none bg-transparent"
                  >
                    Cómo Funciona
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLandingScroll('funcionalidades')}
                    className="w-full text-left md:text-center text-sm font-semibold text-slate-500 hover:text-[#005cbf] hover:bg-slate-50 md:hover:bg-transparent transition-all duration-150 cursor-pointer py-2 px-3 rounded-lg border-none bg-transparent"
                  >
                    Funcionalidades
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLandingScroll('acerca-de')}
                    className="w-full text-left md:text-center text-sm font-semibold text-slate-500 hover:text-[#005cbf] hover:bg-slate-50 md:hover:bg-transparent transition-all duration-150 cursor-pointer py-2 px-3 rounded-lg border-none bg-transparent"
                  >
                    Acerca de
                  </button>
                </li>
                {/* Mobile login button */}
                <li className="md:hidden mt-2 pt-2 border-t border-slate-100 w-full">
                  <Link
                    to="/login"
                    className="w-full text-center text-sm font-bold text-[#005cbf] bg-blue-50/50 hover:bg-blue-50 py-2 px-3 rounded-lg border border-blue-200 transition-all duration-150 cursor-pointer block no-underline"
                  >
                    Iniciar sesión
                  </Link>
                </li>
              </>
            ) : (
              // Logged in / App Navbar links
              <>
                <li>
                  <Link to="/dashboard" className={linkCls('/dashboard')}>
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/categorias" className={linkCls('/categorias')}>
                    Categorías
                  </Link>
                </li>
                {/* Mobile user button */}
                <li className="md:hidden mt-2 pt-2 border-t border-slate-100 flex justify-center w-full">
                  <button
                    onClick={() => signOut({ redirectUrl: '/' })}
                    className="w-full text-center text-sm font-bold text-red-500 bg-red-50/50 hover:bg-red-50 py-2 px-3 rounded-lg border border-red-200 transition-all duration-150 cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        )}

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoginOrSignUpPath ? (
            <Link
              to="/"
              className="border border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-sm py-2 px-5 rounded-full cursor-pointer hover:bg-slate-50 transition-all duration-150 no-underline"
            >
              Volver al inicio
            </Link>
          ) : !isSignedIn ? (
            <Link
              to="/login"
              className="border border-blue-200 hover:border-[#005cbf] text-[#005cbf] font-bold text-sm py-2 px-5 rounded-full cursor-pointer hover:bg-blue-50/50 transition-all duration-150 no-underline"
            >
              Iniciar sesión
            </Link>
          ) : (
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              className="border border-slate-200 hover:border-red-200 hover:text-red-500 text-slate-600 font-bold text-sm py-2 px-5 rounded-full cursor-pointer hover:bg-red-50/10 transition-all duration-150"
            >
              Cerrar sesión
            </button>
          )}
        </div>

        {/* Mobile menu toggle (Only visible when not on login/signup pages) */}
        {!isLoginOrSignUpPath && (
          <button
            className="flex md:hidden flex-col gap-1.5 p-2 rounded-lg my-auto cursor-pointer"
            onClick={() => setMenuOpen(p => !p)}
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className={`block w-[22px] h-[2px] bg-slate-900 rounded-sm transition-all duration-250 ${
              menuOpen ? 'rotate-45 translate-y-[5.5px]' : ''
            }`} />
            <span className={`block w-[22px] h-[2px] bg-slate-900 rounded-sm transition-all duration-250 ${
              menuOpen ? 'opacity-0' : ''
            }`} />
            <span className={`block w-[22px] h-[2px] bg-slate-900 rounded-sm transition-all duration-250 ${
              menuOpen ? '-rotate-45 translate-y-[-5.5px]' : ''
            }`} />
          </button>
        )}
      </nav>
      <p className="sr-only" aria-live="polite">{APP_NAME}</p>
    </header>
  );
}

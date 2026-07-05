import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/react';
import './index.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTopButton from './components/shared/ScrollToTopButton';
import AccessibilityToggle from './components/shared/AccessibilityToggle';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import { NAV } from './constants/copy';

// ProtectedRoute ensures that only authenticated users can access the component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
      </main>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// PublicRoute ensures that authenticated users are redirected away from public auth pages
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
      </main>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Placeholder pages for routes not yet fully built
function PlaceholderPage({ title }: { title: string }) {
  return (
    <main id="main-content" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Esta sección estará disponible próximamente.
      </p>
      <LinkBack />
    </main>
  );
}

function LinkBack() {
  const { isSignedIn } = useAuth();
  return (
    <a
      href={isSignedIn ? "/dashboard" : "/"}
      style={{
        display: 'inline-block',
        marginTop: '2rem',
        color: 'var(--color-primary)',
        fontWeight: 600,
        fontSize: '1rem',
      }}
    >
      ← Volver al inicio
    </a>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Skip to content link (WCAG) */}
      <a href="#main-content" className="skip-link">{NAV.skipToContent}</a>

      {/* Persistent navbar */}
      <Navbar />

      {/* Page routes */}
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        
        {/* Login Page */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />

        {/* Sign Up Page */}
        <Route path="/sign-up" element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        } />
        
        {/* App Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        {/* Medication Detail */}
        <Route path="/medicamento/:slug" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />
        
        {/* Categories */}
        <Route path="/categorias" element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        } />
        <Route path="/categorias/:categoryId" element={
          <ProtectedRoute>
            <CategoryDetailPage />
          </ProtectedRoute>
        } />
        
        {/* Placeholders */}
        <Route path="/buscar" element={
          <ProtectedRoute>
            <PlaceholderPage title="Búsqueda de Medicamentos" />
          </ProtectedRoute>
        } />
        <Route path="/alertas" element={
          <ProtectedRoute>
            <PlaceholderPage title="Alertas de Desabastecimiento" />
          </ProtectedRoute>
        } />
        <Route path="/alto-riesgo" element={
          <ProtectedRoute>
            <PlaceholderPage title="Medicamentos de Alto Riesgo" />
          </ProtectedRoute>
        } />
        <Route path="*" element={<PlaceholderPage title="Página no encontrada" />} />
      </Routes>

      {/* Persistent footer */}
      <Footer />

      {/* Global scroll-to-top button (visible after 25% scroll) */}
      <ScrollToTopButton />

      {/* Global font-size accessibility scaling button */}
      <AccessibilityToggle />
    </BrowserRouter>
  );
}

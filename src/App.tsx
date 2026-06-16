import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useClearance } from '@/hooks/useClearance';
import { useCyberpunk } from '@/hooks/useCyberpunk';
import { useLuxuryMode } from '@/hooks/useLuxuryMode';
import { useHotelTheme } from '@/hooks/useHotelTheme';
import { GlobalStyleWrapper } from '@/components/GlobalStyleWrapper';
import { CyberpunkOverlay } from '@/components/CyberpunkOverlay';
import { LoginPage } from '@/pages/LoginPage';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ============ LAZY LOAD DASHBOARDS (code splitting) ============

const MainLayout = lazy(() => import('@/layouts/MainLayout').then(m => ({ default: m.MainLayout })));

// ============ LOADING SPINNER ============

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <p className="mt-4 text-sm text-muted font-mono">Chargement...</p>
      </div>
    </div>
  );
}

// ============ PROTECTED ROUTE ============

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

// ============ APP ============

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <MainLayout />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  // Init hooks globaux
  useHotelTheme();
  const { enabled: cyberpunkEnabled } = useCyberpunk();
  const { enabled: luxuryEnabled } = useLuxuryMode();
  useClearance(); // Init RBAC

  return (
    <>
      <GlobalStyleWrapper />
      <CyberpunkOverlay enabled={cyberpunkEnabled} intensity="medium" />
      <div className={luxuryEnabled ? 'luxury-mode' : ''}>
        {children}
      </div>
    </>
  );
}

export default App;

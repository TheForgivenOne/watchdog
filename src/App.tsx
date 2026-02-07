import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './core/components/Layout';
import { LoadingSpinner } from './core/components/LoadingSpinner';
import { ErrorBoundary } from './core/components/ErrorBoundary';
import { HubDashboard } from './core/pages/HubDashboard';
import { SettingsPage } from './core/pages/SettingsPage';
import { NotFound } from './core/pages/NotFound';

// Lazy load subdogs for code splitting
const NewsRoutes = lazy(() => import('./subdogs/news/routes'));
const WeatherRoutes = lazy(() => import('./subdogs/weather/routes'));
const TestCache = lazy(() => import('./pages/TestCache'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HubDashboard />
              </Layout>
            }
          />
          <Route
            path="/news/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NewsRoutes />
              </Suspense>
            }
          />
          <Route
            path="/weather/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <WeatherRoutes />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          />
          <Route
            path="/test-cache"
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <TestCache />
                </Suspense>
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

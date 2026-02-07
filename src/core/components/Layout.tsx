import { Suspense, type ReactNode } from 'react';
import { Navigation } from './Navigation';
import { LoadingSpinner } from './LoadingSpinner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="pt-16">
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}

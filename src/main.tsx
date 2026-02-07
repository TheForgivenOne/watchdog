import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import './index.css';
import App from './App.tsx';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ConvexProvider>
  </StrictMode>,
);

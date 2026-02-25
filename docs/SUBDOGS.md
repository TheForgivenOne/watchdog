# Subdogs (Plugin System)

Documentation for Watchdog's subdog plugin architecture.

## Overview

Subdogs are self-contained feature modules that extend Watchdog's functionality. Each subdog includes its own routes, components, hooks, services, and page layouts. This modular architecture allows for easy addition of new features without modifying core code.

## Current Subdogs

| Subdog | Path | Description |
|--------|------|-------------|
| News | `/news/*` | NewsData.io integration with categories and search |
| Weather | `/weather/*` | Open-Meteo integration with forecasts and geocoding |

## Subdog Structure

Each subdog follows a consistent directory structure:

```
src/subdogs/{subdog-name}/
├── components/       # Subdog-specific UI components
├── hooks/           # Subdog-specific React hooks
├── page/            # Page-level components
├── services/        # API integration
├── types/           # TypeScript type definitions
├── routes.tsx       # Route definitions (lazy-loaded)
└── index.ts         # Entry point
```

## Subdog Interface

Subdogs are defined by the `Subdog` interface:

```typescript
// src/core/types/index.ts
interface Subdog {
  id: string;          // Unique identifier
  name: string;        // Display name
  description: string; // Brief description
  path: string;        // Route prefix (e.g., '/news')
  icon: string;        // Icon component name (Lucide)
  color: string;       // Theme color (Tailwind class)
}
```

## Registering a New Subdog

### Step 1: Add to Registry

Edit `src/core/utils/subdogs.ts`:

```typescript
import type { Subdog } from '../types';

export const subdogs: Subdog[] = [
  {
    id: 'news',
    name: 'News',
    description: 'Stay informed with the latest headlines',
    path: '/news',
    icon: 'Newspaper',
    color: 'blue'
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Check current conditions and forecasts',
    path: '/weather',
    icon: 'Cloud',
    color: 'sky'
  },
  // Add new subdog here
  {
    id: 'sports',
    name: 'Sports',
    description: 'Latest sports scores and news',
    path: '/sports',
    icon: 'Trophy',
    color: 'orange'
  }
];
```

### Step 2: Add Lazy Route

Edit `src/App.tsx`:

```typescript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';

// Lazy load subdog routes
const NewsRoutes = lazy(() => import('./subdogs/news/routes'));
const WeatherRoutes = lazy(() => import('./subdogs/weather/routes'));
const SportsRoutes = lazy(() => import('./subdogs/sports/routes')); // New

function App() {
  return (
    <Routes>
      <Route path="/news/*" element={<Suspense fallback={<LoadingSpinner />}><NewsRoutes /></Suspense>} />
      <Route path="/weather/*" element={<Suspense fallback={<LoadingSpinner />}><WeatherRoutes /></Suspense>} />
      <Route path="/sports/*" element={<Suspense fallback={<LoadingSpinner />}><SportsRoutes /></Suspense>} /> // New
    </Routes>
  );
}
```

### Step 3: Create Subdog Directory

Create the subdog directory structure:

```
src/subdogs/sports/
├── components/
│   └── SportsCard.tsx
├── hooks/
│   └── useSports.ts
├── page/
│   └── SportsPage.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── routes.tsx
└── index.ts
```

## Subdog Route Definition

Each subdog defines its routes in `routes.tsx`:

```typescript
// src/subdogs/sports/routes.tsx
import { Routes, Route } from 'react-router';
import { Suspense } from 'react';
import { LoadingSpinner } from '../../core/components/LoadingSpinner';
import { SportsPage } from './page/SportsPage';

export default function SportsRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<SportsPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Suspense>
  );
}
```

## News Subdog

### Structure

```
src/subdogs/news/
├── components/
│   ├── NewsCard.tsx
│   ├── NewsFilters.tsx
│   └── NewsGrid.tsx
├── hooks/
│   ├── useNews.ts
│   └── useCachedNews.ts
├── page/
│   ├── NewsPage.tsx
│   └── NewsDetailPage.tsx
├── services/
│   └── api.ts        # NewsData.io integration
├── types/
│   └── index.ts
└── routes.tsx
```

### Features

- Category filtering (top, business, technology, sports, science, health, entertainment)
- Search functionality
- Pagination
- Article bookmarking
- Recent articles tracking

### API Integration

Uses NewsData.io API. See [API.md](./API.md) for details.

---

## Weather Subdog

### Structure

```
src/subdogs/weather/
├── components/
│   ├── WeatherCard.tsx
│   ├── Forecast.tsx
│   ├── LocationSearch.tsx
│   └── SavedLocations.tsx
├── hooks/
│   ├── useWeather.ts
│   └── useCachedWeather.ts
├── page/
│   ├── WeatherPage.tsx
│   └── WeatherDetailPage.tsx
├── services/
│   └── api.ts        # Open-Meteo integration
├── types/
│   └── index.ts
└── routes.tsx
```

### Features

- Current weather display
- 5-day forecast
- Location search (geocoding)
- Saved locations management
- Temperature unit toggle (Celsius/Fahrenheit)

### API Integration

Uses Open-Meteo API (free, no API key required). See [API.md](./API.md) for details.

---

## Subdog Best Practices

1. **Naming**: Use lowercase with hyphens for directory names (e.g., `sports`, `finance`)
2. **Lazy Loading**: Always lazy-load subdog routes for code splitting
3. **Types**: Define TypeScript interfaces in `types/index.ts`
4. **Caching**: Use cached hooks for API calls (see [CACHING.md](./CACHING.md))
5. **Components**: Keep subdog-specific components in the subdog's `components/` folder
6. **Routes**: Define all routes under the subdog's path prefix

## Hub Integration

The HubDashboard displays widgets from each subdog based on user preferences. To add a widget:

1. Create a preview component in your subdog's `components/` folder
2. Add widget visibility toggle to the hubStore
3. Update HubDashboard to conditionally render your widget

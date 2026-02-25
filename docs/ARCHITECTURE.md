# Architecture

High-level system design for the Watchdog project.

## System Overview

Watchdog is a modular dashboard application built with React and Convex. It uses a plugin-based architecture ("subdogs") to provide feature-specific functionality while sharing common infrastructure.

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
├─────────────────────────────────────────────────────────┤
│  React App                                                │
│  ├── App.tsx (Routing, ErrorBoundary)                    │
│  ├── src/core/ (Shared)                                   │
│  │   ├── components/ (Layout, LoadingSpinner, etc.)      │
│  │   ├── pages/ (HubDashboard, SettingsPage)            │
│  │   ├── store/ (Zustand: hubStore)                      │
│  │   ├── hooks/ (Core hooks)                              │
│  │   └── utils/ (subdogs.ts)                             │
│  ├── src/subdogs/ (Plugins)                              │
│  │   ├── news/ (News module)                            │
│  │   └── weather/ (Weather module)                      │
│  └── src/hooks/ (Custom hooks)                           │
├─────────────────────────────────────────────────────────┤
│                    Convex (Backend)                       │
│  ├── Database (10 tables)                                 │
│  ├── API Functions (queries, mutations, actions)        │
│  └── Cache Functions                                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 External APIs                            │
│  ├── NewsData.io (News articles)                        │
│  └── Open-Meteo (Weather, Geocoding)                    │
└─────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── ErrorBoundary
│   └── BrowserRouter
│       └── Routes
│           ├── Layout + HubDashboard (/)
│           ├── NewsRoutes (/news/*)
│           ├── WeatherRoutes (/weather/*)
│           ├── Layout + SettingsPage (/settings)
│           ├── Layout + TestCache (/test-cache)
│           └── Layout + NotFound (*)
```

## Data Flow

### 1. User Request Flow

1. User navigates to a route (e.g., `/news/technology`)
2. React Router matches the route
3. Lazy-loaded subdog component loads
4. Subdog's hooks fetch data from Convex
5. Convex queries check cache
6. If cache miss or stale, Convex calls external API
7. Data returned to client and cached

### 2. Cache Layer Architecture

```
Client Request
      │
      ▼
┌─────────────────┐
│  React Query    │ (Client-side caching)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Convex Query   │ (Server-side caching)
└────────┬────────┘
         │
    ┌────┴────┐
    │ Cache   │
    │ Hit?    │
    └────┬────┘
    Yes  │  No
    ┌────┴────┐
    │ Return  │     ┌─────────────────┐
    │ Cached   │────▶│ External API    │
    │ Data     │     │ (NewsData/      │
    └─────────┘     │  Open-Meteo)    │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │ Store in Cache │
                    │ + Archive      │
                    └─────────────────┘
```

## State Management

### Client State (Zustand)
- **hubStore**: User preferences, widget visibility, recent items
- Persisted to localStorage (`watchdog-hub-storage`)
- Synchronous state updates

### Server State (React Query + Convex)
- **React Query**: Client-side caching, background refetching
- **Convex**: Server-side caching, database persistence
- Automatic stale-while-revalidate patterns

## Key Modules

### Core (`src/core/`)

| Module | Purpose |
|--------|---------|
| `components/` | Reusable UI: Layout, LoadingSpinner, ErrorBoundary |
| `pages/` | HubDashboard, SettingsPage, NotFound |
| `store/` | Zustand store (hubStore.ts) |
| `hooks/` | Core hooks (useTheme, etc.) |
| `utils/` | Subdog registry, utilities |
| `types/` | Shared TypeScript types |

### Subdogs (`src/subdogs/`)

Each subdog is self-contained with:

```
subdog/
├── routes.tsx       # Route definitions
├── components/     # Subdog-specific components
├── hooks/          # Subdog-specific hooks
├── services/       # API integration
├── types/          # Subdog types
└── page/           # Subdog page components
```

### Convex (`convex/`)

| File | Purpose |
|------|---------|
| `schema.ts` | Database schema (10 tables) |
| `cache.ts` | News caching functions |
| `cacheWeather.ts` | Weather/geocoding caching |

## Database Tables

See [DATABASE.md](./DATABASE.md) for detailed schema information.

## External Integrations

See [API.md](./API.md) for external API documentation.

## Routing

See [ROUTING.md](./ROUTING.md) for navigation structure.

## Performance Optimizations

1. **Code Splitting**: Lazy-loaded subdogs via React.lazy
2. **Caching**: Multi-layer caching (client, server, external)
3. **Memoization**: React.memo, useMemo, useCallback
4. **Suspense**: Loading states for async operations

## Security

- API keys stored in environment variables
- Convex handles backend logic server-side
- No sensitive data exposed to client

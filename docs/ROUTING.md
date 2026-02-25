# Routing

Documentation for Watchdog's navigation and route structure.

## Overview

Watchdog uses React Router v7 for navigation. Routes are organized hierarchically with lazy-loaded subdogs.

## Route Structure

```
/
├── /news/*          # News subdog routes
├── /weather/*       # Weather subdog routes
├── /settings        # Settings page
├── /test-cache      # Cache testing page
└── /*               # Not found
```

## Main Routes

**File:** `src/App.tsx`

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

const NewsRoutes = lazy(() => import('./subdogs/news/routes'));
const WeatherRoutes = lazy(() => import('./subdogs/weather/routes'));
const TestCache = lazy(() => import('./pages/TestCache'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HubDashboard /></Layout>} />
        <Route path="/news/*" element={<NewsRoutes />} />
        <Route path="/weather/*" element={<WeatherRoutes />} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="/test-cache" element={<Layout><TestCache /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Route Definitions

### Hub (Home)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HubDashboard | Main dashboard with widgets |

### News Subdog

| Path | Component | Description |
|------|-----------|-------------|
| `/news` | NewsPage | News feed with categories |
| `/news/:category` | NewsPage | Category-filtered news |

**File:** `src/subdogs/news/routes.tsx`

```typescript
export default function NewsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="/:category" element={<NewsPage />} />
    </Routes>
  );
}
```

### Weather Subdog

| Path | Component | Description |
|------|-----------|-------------|
| `/weather` | WeatherPage | Weather dashboard |
| `/weather/:locationId` | WeatherDetailPage | Specific location |

**File:** `src/subdogs/weather/routes.tsx`

```typescript
export default function WeatherRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WeatherPage />} />
      <Route path="/:locationId" element={<WeatherDetailPage />} />
    </Routes>
  );
}
```

### Settings

| Path | Component | Description |
|------|-----------|-------------|
| `/settings` | SettingsPage | User preferences |

### Test

| Path | Component | Description |
|------|-----------|-------------|
| `/test-cache` | TestCache | Cache testing utilities |

### Catch-all

| Path | Component | Description |
|------|-----------|-------------|
| `*` | NotFound | 404 page |

---

## Navigation

### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router';

function Component() {
  const navigate = useNavigate();
  
  // Navigate to news
  navigate('/news');
  
  // Navigate to specific category
  navigate('/news/technology');
}
```

### Link Navigation

```typescript
import { Link } from 'react-router';

<Link to="/news">News</Link>
<Link to="/weather">Weather</Link>
<Link to="/settings">Settings</Link>
```

---

## Lazy Loading

Subdogs are lazy-loaded for code splitting:

```typescript
const NewsRoutes = lazy(() => import('./subdogs/news/routes'));
const WeatherRoutes = lazy(() => import('./subdogs/weather/routes'));
```

Each subdog route is wrapped in Suspense:

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <NewsRoutes />
</Suspense>
```

---

## Nested Routes

Subdog routes can have nested routes:

```typescript
// Weather with nested routes
<Routes>
  <Route path="/" element={<WeatherPage />} />
  <Route path="/search" element={<LocationSearch />} />
  <Route path="/saved" element={<SavedLocations />} />
</Routes>
```

---

## Route Parameters

### URL Parameters

```typescript
// News category
<Route path="/news/:category" element={<NewsPage />} />

// In component
const { category } = useParams(); // e.g., 'technology'

// Weather location
<Route path="/weather/:locationId" element={<WeatherDetailPage />} />

// In component  
const { locationId } = useParams();
```

### Query Parameters

```typescript
// URL: /news?page=2&q=technology
const { searchParams } = useLocation();
const page = searchParams.get('page'); // '2'
const query = searchParams.get('q'); // 'technology'
```

---

## Navigation Guards

### Redirect Based on State

```typescript
import { Navigate } from 'react-router';

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
```

---

## Active Routes

### Highlight Active Link

```typescript
import { NavLink } from 'react-router';

<NavLink 
  to="/news"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  News
</NavLink>
```

---

## Best Practices

1. **Lazy Loading**: Always lazy-load subdog routes
2. **Suspense**: Wrap lazy routes in Suspense with fallback
3. **ErrorBoundary**: Wrap routes in ErrorBoundary for error handling
4. **Path Prefix**: Use wildcard (`/*`) for nested subdog routes
5. **Catch-all**: Always have a catch-all route for 404s

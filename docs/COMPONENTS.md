# Component Library

Documentation for Watchdog's component architecture and patterns.

## Overview

Watchdog uses a hierarchical component structure:

1. **Core Components** (`src/core/components/`) - Shared across all features
2. **Subdog Components** (`src/subdogs/*/components/`) - Feature-specific
3. **Page Components** (`src/core/pages/`, `src/subdogs/*/page/`) - Route-level

## Core Components

Located in `src/core/components/`:

### Layout

Wraps pages with navigation and structure.

```typescript
import { Layout } from './core/components/Layout';

<Layout>
  <YourContent />
</Layout>
```

**Props:**
- `children`: ReactNode - Page content

### ErrorBoundary

Catches React errors and displays fallback UI.

```typescript
import { ErrorBoundary } from './core/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Catches render errors
- Displays error message with retry option
- Logs errors to console

### LoadingSpinner

Full-screen loading indicator for async operations.

```typescript
import { LoadingSpinner } from './core/components/LoadingSpinner';

<LoadingSpinner />
// or with message
<LoadingSpinner message="Loading data..." />
```

**Props:**
- `message?`: string - Optional loading message

### Navigation

Main navigation component with links to all subdogs.

```typescript
import { Navigation } from './core/components/Navigation';

<Navigation />
```

**Features:**
- Links to hub, news, weather
- Active route highlighting
- Responsive design

### SubdogCard

Card component for displaying subdog information on the hub.

```typescript
import { SubdogCard } from './core/components/SubdogCard';

<SubdogCard
  id="news"
  name="News"
  description="Latest headlines"
  path="/news"
  icon="Newspaper"
  color="blue"
/>
```

**Props:**
- `id`: string - Subdog identifier
- `name`: string - Display name
- `description`: string - Brief description
- `path`: string - Navigation path
- `icon`: string - Icon name (Lucide)
- `color`: string - Theme color (Tailwind)

---

## Subdog Components

### News Components

Located in `src/subdogs/news/components/`:

| Component | Description |
|-----------|-------------|
| `NewsCard` | Individual news article card |
| `NewsFilters` | Category and search filter controls |
| `NewsGrid` | Grid layout for news articles |

### Weather Components

Located in `src/subdogs/weather/components/`:

| Component | Description |
|-----------|-------------|
| `WeatherCard` | Current weather display |
| `Forecast` | 5-day forecast display |
| `LocationSearch` | Location search input with autocomplete |
| `SavedLocations` | List of saved locations |

---

## Component Patterns

### Functional Components

All components are functional with TypeScript:

```typescript
interface ComponentProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function Component({ title, onClick, disabled }: ComponentProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
}
```

### Props Naming Conventions

- `on*` - Event handlers (onClick, onSubmit)
- `is*`, `has*` - Boolean flags (isLoading, hasError)
- `handle*` - Internal handlers (handleSubmit)

### Styled Components

Using Tailwind CSS utility classes:

```typescript
export function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}
```

---

## Shared Patterns

### Loading States

```typescript
if (isLoading) {
  return <LoadingSpinner />;
}
```

### Error States

```typescript
if (error) {
  return <div className="text-red-500">Error: {error.message}</div>;
}
```

### Empty States

```typescript
if (!data || data.length === 0) {
  return <div className="text-gray-500">No items found</div>;
}
```

---

## Theming

Components use Tailwind CSS for styling with consistent colors:

- **Primary**: blue-* (news, links)
- **Secondary**: sky-* (weather)
- **Success**: green-*
- **Error**: red-*
- **Neutral**: gray-*

### Color Usage by Subdog

| Subdog | Color | Tailwind |
|--------|-------|----------|
| News | Blue | blue-500 |
| Weather | Sky | sky-500 |

---

## Best Practices

1. **Single Responsibility**: Each component does one thing well
2. **Props Interface**: Always define TypeScript interface for props
3. **Default Props**: Use destructuring with defaults
4. **Memoization**: Wrap expensive children with React.memo
5. **Error Boundaries**: Wrap async operations in ErrorBoundary

---

## Icons

Watchdog uses Lucide React for icons:

```typescript
import { Newspaper, Cloud, Search, Settings } from 'lucide-react';

<Newspaper className="w-5 h-5" />
```

Common icons:
- `Newspaper` - News subdog
- `Cloud` - Weather
- `Search` - Search
- `Settings` - Settings
- `Bookmark` - Bookmarks
- `MapPin` - Locations

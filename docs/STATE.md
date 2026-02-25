# State Management

Documentation for Watchdog's state management approach.

## Overview

Watchdog uses a layered state management approach:

1. **React Hooks** - Component-local state
2. **Zustand** - Global client state (persisted to localStorage)
3. **React Query** - Server state with caching
4. **Convex** - Backend database state

## State Layers

```
┌─────────────────────────────────────┐
│         React Components            │
├─────────────────────────────────────┤
│  Local State (useState, useReducer) │
├─────────────────────────────────────┤
│  Zustand (hubStore)                 │
│  - Widget visibility                │
│  - User preferences                 │
│  - Recent items                     │
├─────────────────────────────────────┤
│  React Query (@tanstack/react-query)│
│  - API response caching             │
│  - Background refetching            │
├─────────────────────────────────────┤
│  Convex (Server Database)           │
│  - Persistent data                   │
│  - Cached API responses             │
└─────────────────────────────────────┘
```

---

## Zustand Store

### Hub Store

**File:** `src/core/store/hubStore.ts`

Global client state with localStorage persistence.

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HubState {
  // Widget visibility
  showNewsPreview: boolean;
  showWeatherWidget: boolean;
  showQuickActions: boolean;
  showRecentActivity: boolean;
  showStats: boolean;

  // Preferences
  newsPreviewCount: number;
  enableAutoRedirect: boolean;
  defaultSubdog: string | null;
  weatherWidgetMode: 'current' | 'saved';
  weatherWidgetLocation: string | null;

  // Recent activity
  recentArticles: RecentArticle[];
  recentLocations: RecentLocation[];
  maxRecentItems: number;

  // Actions
  toggleWidget: (widget: string) => void;
  setNewsPreviewCount: (count: number) => void;
  setAutoRedirect: (enabled: boolean, subdogId?: string | null) => void;
  setWeatherWidgetMode: (mode: 'current' | 'saved', locationId?: string | null) => void;
  addRecentArticle: (article: RecentArticle) => void;
  addRecentLocation: (location: RecentLocation) => void;
  clearRecentArticles: () => void;
  clearRecentLocations: () => void;
}

export const useHubStore = create<HubState>()(
  persist(
    (set) => ({
      // Default state
      showNewsPreview: true,
      showWeatherWidget: true,
      showQuickActions: true,
      showRecentActivity: true,
      showStats: true,
      newsPreviewCount: 4,
      enableAutoRedirect: false,
      defaultSubdog: null,
      weatherWidgetMode: 'current',
      weatherWidgetLocation: null,
      recentArticles: [],
      recentLocations: [],
      maxRecentItems: 10,

      // Actions
      toggleWidget: (widget) => {
        const key = `show${widget}` as keyof HubState;
        set((state) => ({
          ...state,
          [key]: !state[key],
        }));
      },
      // ... other actions
    }),
    {
      name: 'watchdog-hub-storage',
    }
  )
);
```

### Usage

```typescript
import { useHubStore } from './core/store/hubStore';

// Read state
const showNewsPreview = useHubStore((state) => state.showNewsPreview);
const recentArticles = useHubStore((state) => state.recentArticles);

// Update state
const toggleWidget = useHubStore((state) => state.toggleWidget);
toggleWidget('NewsPreview');

const addRecentArticle = useHubStore((state) => state.addRecentArticle);
addRecentArticle({ id: '123', title: 'Article', source: 'News', viewedAt: new Date().toISOString() });
```

### Data Types

```typescript
interface RecentArticle {
  id: string;
  title: string;
  source: string;
  viewedAt: string;
}

interface RecentLocation {
  name: string;
  latitude: number;
  longitude: number;
  searchedAt: string;
}
```

---

## React Query

Server state management with caching.

### Setup

```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000,   // 30 minutes
      retry: 1,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### Usage

```typescript
import { useQuery } from '@tanstack/react-query';

function NewsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['news', category],
    queryFn: () => fetchNews({ category }),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <NewsGrid articles={data.results} />;
}
```

---

## Convex (Server State)

Database state accessed through Convex hooks.

### Queries

```typescript
import { useQuery } from 'convex/react';

function Bookmarks() {
  const bookmarks = useQuery(api.bookmarks.list, { userId });
  return bookmarks?.map(b => <BookmarkCard key={b._id} {...b} />);
}
```

### Mutations

```typescript
import { useMutation } from 'convex/react';

function SaveButton({ article }) {
  const bookmark = useMutation(api.bookmarks.add);

  const handleSave = () => {
    bookmark({
      articleId: article.article_id,
      title: article.title,
      source: article.source_name,
      url: article.link,
    });
  };

  return <button onClick={handleSave}>Save</button>;
}
```

---

## When to Use What

| Use Case | Solution |
|----------|----------|
| Component UI state (open/closed) | `useState` |
| Global UI preferences | Zustand |
| Recent items (persisted) | Zustand |
| User preferences (persisted) | Convex |
| API data with caching | React Query |
| API data with persistence | Convex |
| Cached API responses | Convex |
| Real-time data | React Query + Convex |

---

## Best Practices

1. **Minimize Global State**: Keep state as local as possible
2. **Use Zustand for UI**: Preferences, widget visibility, recent items
3. **Use React Query for APIs**: Fetching, caching, background refresh
4. **Use Convex for Persistence**: User data, bookmarks, saved locations
5. **Memoize Selectors**: Prevent unnecessary re-renders

```typescript
// Bad: Re-renders on any store change
const name = useHubStore((state) => state);

// Good: Only re-renders when name changes
const name = useHubStore((state) => state.name);
```

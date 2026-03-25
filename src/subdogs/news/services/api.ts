import type { NewsFilters } from '../types';

// These types are exported for use in hooks
export type { NewsFilters };

// Re-export server-side proxy mutations from useCachedNews hook
// The actual news fetching now happens via Convex server-side proxy
// where the API key is kept secure

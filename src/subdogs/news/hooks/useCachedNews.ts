import { useQuery } from '@tanstack/react-query';
import { useQuery as useConvexQuery, useMutation as useConvexMutation } from 'convex/react';
import type { NewsFilters, NewsResponse } from '../types';
import { fetchNews } from '../services/api';
import { api } from '../../../../convex/_generated/api';
import { useEffect } from 'react';

const NEWS_CACHE_KEY = 'cached-news';

interface CachedNewsData {
  cacheKey: string;
  category?: string;
  query?: string;
  country?: string;
  language?: string;
  page?: number;
  status: string;
  totalResults: number;
  results: any[];
  nextPage?: string;
  fetchedAt: number;
  expiresAt: number;
  isStale?: boolean;
}

/**
 * Hook to fetch news with caching support
 * First checks Convex cache, falls back to API if needed
 */
export function useCachedNews(filters: NewsFilters = {}, userId?: string) {
  // Check cache first using Convex
  const cachedData = useConvexQuery(
    api.cache.getCachedNews,
    {
      category: filters.category,
      query: filters.query,
      country: filters.country,
      language: filters.language,
      page: undefined, // Pagination not implemented in filters yet
      userId,
    }
  );

  // Mutation to store data in cache
  const cacheNewsMutation = useConvexMutation(api.cache.cacheNews);

  // Determine if we should use cache or fetch fresh
  const hasValidCache = cachedData && !(cachedData as CachedNewsData).isStale;
  const hasCache = !!cachedData;

  // Main query that uses cache or fetches from API
  const { data, error, refetch } = useQuery<NewsResponse, Error>({
    queryKey: [NEWS_CACHE_KEY, filters, userId],
    queryFn: async () => {
      console.log('[News Cache] Fetching from API');
      const response = await fetchNews(filters);

      // Store in cache (don't await to avoid blocking)
      cacheNewsMutation({
        category: filters.category,
        query: filters.query,
        country: filters.country,
        language: filters.language,
        page: undefined,
        status: response.status,
        totalResults: response.totalResults,
        results: response.results,
        nextPage: response.nextPage || undefined,
        userId,
      }).catch(err => {
        console.error('[News Cache] Failed to cache data:', err);
      });

      return response;
    },
    // Use cached data as initial data if available
    initialData: cachedData
      ? ({
          status: (cachedData as CachedNewsData).status,
          totalResults: (cachedData as CachedNewsData).totalResults,
          results: (cachedData as CachedNewsData).results,
          nextPage: (cachedData as CachedNewsData).nextPage,
        } as NewsResponse)
      : undefined,
    // Cache-first: only run query if no valid cache
    enabled: !hasValidCache,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Background refresh when data is stale (only if we have cache)
  useEffect(() => {
    if ((cachedData as CachedNewsData | undefined)?.isStale) {
      console.log('[News Cache] Data is stale, refreshing in background');
      refetch();
    }
  }, [(cachedData as CachedNewsData | undefined)?.isStale, refetch]);

  return {
    data,
    isLoading: !hasCache,
    error,
    refetch,
    isCached: hasCache,
    isStale: (cachedData as CachedNewsData | undefined)?.isStale || false,
  };
}

/**
 * Hook to fetch latest news with caching
 */
export function useCachedLatestNews(userId?: string) {
  return useCachedNews({ category: 'top' }, userId);
}

/**
 * Hook to get archived news articles
 */
export function useArchivedNews(userId?: string, limit?: number, category?: string) {
  return useConvexQuery(api.cache.getArchivedNews, {
    userId,
    limit,
    category,
  });
}

/**
 * Hook to get cache statistics
 */
export function useNewsCacheStats(userId?: string) {
  return useConvexQuery(api.cache.getCacheStats, { userId });
}

/**
 * Hook to manually clear news cache
 */
export function useClearNewsCache() {
  const clearCacheMutation = useConvexMutation(api.cache.clearUserNewsCache);

  return {
    clearCache: async (userId?: string) => {
      await clearCacheMutation({ userId });
    },
    isPending: false, // Convex mutation doesn't expose isPending directly in this pattern
  };
}

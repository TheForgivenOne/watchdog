import { useQuery } from '@tanstack/react-query';
import { useQuery as useConvexQuery, useMutation as useConvexMutation } from 'convex/react';
import type { NewsResponse } from '../subdogs/news/types';
import { fetchNews } from '../subdogs/news/services/api';
import { api } from '../../convex/_generated/api';
import { useEffect } from 'react';

/**
 * Simple test hook to verify news caching works
 */
export function useTestNewsCache() {
  // Try to get cached news using direct function call
  const cachedData = useConvexQuery(api.cache.getCachedNews, {
    category: 'top',
    query: undefined,
    country: undefined,
    language: undefined,
    page: undefined,
    userId: undefined,
  });

  // Mutation to store data
  const cacheMutation = useConvexMutation(api.cache.cacheNews);

  // Main query
  const { data, isLoading, error } = useQuery<NewsResponse, Error>({
    queryKey: ['test-news-cache'],
    queryFn: async () => {
      console.log('[Test Cache] Cached data:', cachedData);
      
      if (cachedData && !(cachedData as any).isStale) {
        console.log('[Test Cache] Using cached data');
        return {
          status: (cachedData as any).status,
          totalResults: (cachedData as any).totalResults,
          results: (cachedData as any).results,
          nextPage: (cachedData as any).nextPage,
        };
      }

      console.log('[Test Cache] Fetching fresh data');
      const response = await fetchNews({ category: 'top' });
      
      // Cache the response
      console.log('[Test Cache] Caching response...');
      await cacheMutation({
        category: 'top',
        query: undefined,
        country: undefined,
        language: undefined,
        page: undefined,
        status: response.status,
        totalResults: response.totalResults,
        results: response.results,
        nextPage: response.nextPage || undefined,
        userId: undefined,
      });

      return response;
    },
    enabled: true,
  });

  useEffect(() => {
    console.log('[Test Cache] Hook state:', {
      isLoading,
      error: error?.message,
      dataCount: data?.results?.length,
      cached: !!cachedData,
    });
  }, [isLoading, error, data, cachedData]);

  return {
    data,
    isLoading,
    error,
    cachedData,
    isCached: !!cachedData,
  };
}
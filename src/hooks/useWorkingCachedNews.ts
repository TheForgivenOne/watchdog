import { useQuery } from '@tanstack/react-query';
import { useQuery as useConvexQuery, useMutation as useConvexMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { NewsResponse } from '../subdogs/news/types';
import { fetchNews } from '../subdogs/news/services/api';

/**
 * Working news cache hook that bypasses type issues
 */
export function useWorkingCachedNews(filters = {}) {
  // Use raw function reference to avoid type issues
  const getCachedNews = api.cache.getCachedNews;
  const cacheNews = api.cache.cacheNews;
  
  // Check cache first
  const cachedData = useConvexQuery(getCachedNews, {
    category: 'top',
    query: undefined,
    country: undefined,
    language: undefined,
    page: undefined,
    userId: undefined,
  });

  // Mutation to store data
  const cacheMutation = useConvexMutation(cacheNews);

  // Main query with caching
  const { data, isLoading, error } = useQuery<NewsResponse, Error>({
    queryKey: ['working-news-cache', filters],
    queryFn: async () => {
      console.log('[Working Cache] Querying cache...');
      console.log('[Working Cache] Cached data:', cachedData);
      
      if (cachedData && !cachedData.isStale) {
        console.log('[Working Cache] Using cached data!');
        return {
          status: cachedData.status,
          totalResults: cachedData.totalResults,
          results: cachedData.results,
          nextPage: cachedData.nextPage,
        };
      }

      console.log('[Working Cache] Fetching fresh data...');
      const response = await fetchNews({ category: 'top' });
      
      // Cache the fresh data
      console.log('[Working Cache] Storing fresh data in cache...');
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
  });

  return {
    data,
    isLoading,
    error,
    isCached: !!cachedData,
    cachedData,
  };
}
import { useQuery as useConvexQuery, useMutation as useConvexMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

/**
 * Combined cache statistics for all subdogs
 */
export function useAllCacheStats(userId?: string) {
  const newsStats = useConvexQuery(api.cache.getCacheStats, { userId });
  const weatherStats = useConvexQuery(api.cacheWeather.getWeatherCacheStats, { userId });

  return {
    news: newsStats,
    weather: weatherStats,
    totalCached: (newsStats?.newsCache?.total || 0) + 
                 (weatherStats?.weatherCache?.total || 0) + 
                 (weatherStats?.geocodingCache?.total || 0),
    totalValid: (newsStats?.newsCache?.valid || 0) + 
                (weatherStats?.weatherCache?.valid || 0) + 
                (weatherStats?.geocodingCache?.valid || 0),
    totalExpired: (newsStats?.newsCache?.expired || 0) + 
                  (weatherStats?.weatherCache?.expired || 0) + 
                  (weatherStats?.geocodingCache?.expired || 0),
  };
}

/**
 * Clear all cache across all subdogs
 */
export function useClearAllCache() {
  const clearNewsCache = useConvexMutation(api.cache.clearUserNewsCache);
  const clearWeatherCache = useConvexMutation(api.cacheWeather.clearUserWeatherCache);

  return {
    clearAll: async (userId?: string) => {
      await Promise.all([
        clearNewsCache({ userId }),
        clearWeatherCache({ userId }),
      ]);
    },
    clearNews: async (userId?: string) => {
      await clearNewsCache({ userId });
    },
    clearWeather: async (userId?: string) => {
      await clearWeatherCache({ userId });
    },
  };
}

/**
 * Cleanup expired cache entries
 * This should be called periodically (e.g., via a scheduled job)
 */
export function useCleanupExpiredCache() {
  const cleanupNews = useConvexMutation(api.cache.clearExpiredCache);
  const cleanupWeather = useConvexMutation(api.cacheWeather.clearExpiredWeatherCache);

  return {
    cleanup: async () => {
      const [newsResult, weatherResult] = await Promise.all([
        cleanupNews({}),
        cleanupWeather({}),
      ]);

      return {
        news: newsResult,
        weather: weatherResult,
        totalCleared: (newsResult?.clearedNews || 0) + 
                      (weatherResult?.clearedWeather || 0) + 
                      (weatherResult?.clearedGeocoding || 0),
      };
    },
  };
}

/**
 * Cache configuration constants
 */
export const CACHE_CONFIG = {
  // Cache durations in milliseconds
  NEWS_CACHE_DURATION: 60 * 60 * 1000, // 1 hour
  WEATHER_CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
  GEOCODING_CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours

  // Stale thresholds (when to refresh in background)
  NEWS_STALE_THRESHOLD: 10 * 60 * 1000, // 10 minutes before expiry
  WEATHER_STALE_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry

  // Maximum cache sizes (approximate)
  MAX_NEWS_CACHE_ENTRIES: 100,
  MAX_WEATHER_CACHE_ENTRIES: 50,
  MAX_GEOCODING_CACHE_ENTRIES: 200,
} as const;

/**
 * Helper to check if cache is enabled for a specific feature
 */
export function isCacheEnabled(): boolean {
  // Cache is always enabled in production
  // Can be disabled via localStorage for debugging
  if (typeof window !== 'undefined') {
    return localStorage.getItem('DISABLE_CACHE') !== 'true';
  }
  return true;
}

/**
 * Helper to disable/enable cache (for debugging)
 */
export function setCacheEnabled(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    if (enabled) {
      localStorage.removeItem('DISABLE_CACHE');
    } else {
      localStorage.setItem('DISABLE_CACHE', 'true');
    }
  }
}

// News cached hooks
export {
  useCachedNews,
  useCachedLatestNews,
  useArchivedNews,
  useNewsCacheStats,
  useClearNewsCache,
} from './subdogs/news/hooks/useCachedNews';

// Weather cached hooks
export {
  useCachedLocationSearch,
  useCachedWeather,
  useWeatherHistory,
  useWeatherCacheStats,
  useClearWeatherCache,
} from './subdogs/weather/hooks/useCachedWeather';

// Cache management utilities
export {
  useAllCacheStats,
  useClearAllCache,
  useCleanupExpiredCache,
  CACHE_CONFIG,
  isCacheEnabled,
  setCacheEnabled,
} from './core/hooks/useCacheManagement';

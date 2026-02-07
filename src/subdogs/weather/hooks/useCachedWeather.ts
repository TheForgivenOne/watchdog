import { useQuery } from '@tanstack/react-query';
import { useQuery as useConvexQuery, useMutation as useConvexMutation } from 'convex/react';
import type { GeocodingResponse, WeatherResponse, TemperatureUnit } from '../types';
import { searchLocations, fetchWeather } from '../services/api';
import { api } from '../../../../convex/_generated/api';
import { useEffect } from 'react';

const WEATHER_CACHE_KEY = 'cached-weather';
const GEOCODING_CACHE_KEY = 'cached-geocoding';

interface CachedWeatherData {
  cacheKey: string;
  latitude: number;
  longitude: number;
  timezone: string;
  timezoneAbbreviation: string;
  elevation: number;
  current: any;
  daily: any;
  currentUnits: any;
  dailyUnits: any;
  fetchedAt: number;
  expiresAt: number;
  isStale?: boolean;
}



/**
 * Hook to search locations with caching support
 */
export function useCachedLocationSearch(query: string, userId?: string) {
  // Check cache first
  const cachedData = useConvexQuery(
    api.cacheWeather.getCachedGeocoding,
    {
      query,
      userId,
    }
  );

  // Mutation to store in cache
  const cacheMutation = useConvexMutation(api.cacheWeather.cacheGeocoding);

  // Cache-first: only fetch if no valid cache
  const hasCache = !!cachedData;

  // Main query
  const { data, error } = useQuery<GeocodingResponse, Error>({
    queryKey: [GEOCODING_CACHE_KEY, query, userId],
    queryFn: async () => {
      console.log('[Geocoding Cache] Fetching from API');
      const response = await searchLocations(query);

      // Store in cache (don't await to avoid blocking)
      if (response.results) {
        cacheMutation({
          query,
          results: response.results,
          resultCount: response.results.length,
          userId,
        }).catch(err => {
          console.error('[Geocoding Cache] Failed to cache data:', err);
        });
      }

      return response;
    },
    initialData: cachedData?.results
      ? ({
          results: cachedData.results,
          generationtime_ms: 0,
        } as GeocodingResponse)
      : undefined,
    enabled: query.length >= 2 && !hasCache,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours for geocoding
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    data,
    isLoading: !hasCache && query.length >= 2,
    error,
    isCached: hasCache,
  };
}

/**
 * Hook to fetch weather with caching support
 */
export function useCachedWeather(
  latitude: number | null,
  longitude: number | null,
  unit: TemperatureUnit = 'celsius',
  userId?: string
) {
  // Check cache first
  const cachedData = useConvexQuery(
    api.cacheWeather.getCachedWeather,
    {
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      userId,
    }
  );

  // Mutation to store in cache
  const cacheMutation = useConvexMutation(api.cacheWeather.cacheWeather);

  // Determine if we should use cache or fetch fresh
  const hasValidCache = cachedData && !(cachedData as CachedWeatherData).isStale;
  const hasCache = !!cachedData;

  // Main query
  const { data, error, refetch } = useQuery<WeatherResponse, Error>({
    queryKey: [WEATHER_CACHE_KEY, latitude, longitude, unit, userId],
    queryFn: async () => {
      if (latitude === null || longitude === null) {
        throw new Error('Latitude and longitude are required');
      }

      console.log('[Weather Cache] Fetching from API');
      const response = await fetchWeather(latitude, longitude, unit);

      // Store in cache (don't await to avoid blocking)
      cacheMutation({
        latitude,
        longitude,
        timezone: response.timezone,
        timezoneAbbreviation: response.timezone_abbreviation,
        elevation: response.elevation,
        current: response.current,
        daily: response.daily,
        currentUnits: response.current_units,
        dailyUnits: response.daily_units,
        userId,
      }).catch(err => {
        console.error('[Weather Cache] Failed to cache data:', err);
      });

      return response;
    },
    initialData: cachedData
      ? ({
          latitude: (cachedData as CachedWeatherData).latitude,
          longitude: (cachedData as CachedWeatherData).longitude,
          timezone: (cachedData as CachedWeatherData).timezone,
          timezone_abbreviation: (cachedData as CachedWeatherData).timezoneAbbreviation,
          elevation: (cachedData as CachedWeatherData).elevation,
          generationtime_ms: 0,
          utc_offset_seconds: 0,
          current: (cachedData as CachedWeatherData).current,
          daily: (cachedData as CachedWeatherData).daily,
          current_units: (cachedData as CachedWeatherData).currentUnits,
          daily_units: (cachedData as CachedWeatherData).dailyUnits,
        } as WeatherResponse)
      : undefined,
    // Cache-first: only run query if no valid cache
    enabled: latitude !== null && longitude !== null && !hasValidCache,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Background refresh when stale (only if we have cache)
  useEffect(() => {
    if ((cachedData as CachedWeatherData | undefined)?.isStale) {
      console.log('[Weather Cache] Data is stale, refreshing in background');
      refetch();
    }
  }, [(cachedData as CachedWeatherData | undefined)?.isStale, refetch]);

  return {
    data,
    isLoading: !hasCache && latitude !== null && longitude !== null,
    error,
    refetch,
    isCached: hasCache,
    isStale: (cachedData as CachedWeatherData | undefined)?.isStale || false,
  };
}

/**
 * Hook to get weather history for a location
 */
export function useWeatherHistory(
  latitude: number,
  longitude: number,
  userId?: string,
  limit?: number
) {
  return useConvexQuery(api.cacheWeather.getWeatherHistory, {
    latitude,
    longitude,
    userId,
    limit,
  });
}

/**
 * Hook to get weather cache statistics
 */
export function useWeatherCacheStats(userId?: string) {
  return useConvexQuery(api.cacheWeather.getWeatherCacheStats, { userId });
}

/**
 * Hook to manually clear weather cache
 */
export function useClearWeatherCache() {
  const clearCacheMutation = useConvexMutation(api.cacheWeather.clearUserWeatherCache);

  return {
    clearCache: async (userId?: string) => {
      await clearCacheMutation({ userId });
    },
    isPending: false,
  };
}

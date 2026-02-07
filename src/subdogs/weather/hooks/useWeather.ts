import { useQuery } from '@tanstack/react-query';
import type { GeocodingResponse, WeatherResponse, TemperatureUnit } from '../types';
import { searchLocations, fetchWeather } from '../services/api';

export function useLocationSearch(query: string) {
  return useQuery<GeocodingResponse, Error>({
    queryKey: ['locationSearch', query],
    queryFn: () => searchLocations(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWeather(
  latitude: number | null,
  longitude: number | null,
  unit: TemperatureUnit = 'celsius'
) {
  return useQuery<WeatherResponse, Error>({
    queryKey: ['weather', latitude, longitude, unit],
    queryFn: () => {
      if (latitude === null || longitude === null) {
        throw new Error('Latitude and longitude are required');
      }
      return fetchWeather(latitude, longitude, unit);
    },
    enabled: latitude !== null && longitude !== null,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });
}

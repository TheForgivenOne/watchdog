import type { GeocodingResponse, WeatherResponse } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';

export async function searchLocations(query: string): Promise<GeocodingResponse> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_BASE_URL}/search?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to search locations: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  unit: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    temperature_unit: unit,
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
    forecast_days: '5',
  });

  const response = await fetch(`${WEATHER_BASE_URL}/forecast?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch weather: ${response.statusText}`);
  }

  return response.json();
}

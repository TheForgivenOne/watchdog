import type { WeatherCodeInfo } from '../types';

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  const weatherCodes: Record<number, { description: string; icon: string }> = {
    0: { description: 'Clear sky', icon: 'sun' },
    1: { description: 'Mainly clear', icon: 'cloud-sun' },
    2: { description: 'Partly cloudy', icon: 'cloud-sun' },
    3: { description: 'Overcast', icon: 'cloud' },
    45: { description: 'Fog', icon: 'cloud-fog' },
    48: { description: 'Depositing rime fog', icon: 'cloud-fog' },
    51: { description: 'Light drizzle', icon: 'cloud-drizzle' },
    53: { description: 'Moderate drizzle', icon: 'cloud-drizzle' },
    55: { description: 'Dense drizzle', icon: 'cloud-drizzle' },
    56: { description: 'Light freezing drizzle', icon: 'cloud-snow' },
    57: { description: 'Dense freezing drizzle', icon: 'cloud-snow' },
    61: { description: 'Slight rain', icon: 'cloud-rain' },
    63: { description: 'Moderate rain', icon: 'cloud-rain' },
    65: { description: 'Heavy rain', icon: 'cloud-rain' },
    66: { description: 'Light freezing rain', icon: 'cloud-snow' },
    67: { description: 'Heavy freezing rain', icon: 'cloud-snow' },
    71: { description: 'Slight snow', icon: 'cloud-snow' },
    73: { description: 'Moderate snow', icon: 'cloud-snow' },
    75: { description: 'Heavy snow', icon: 'cloud-snow' },
    77: { description: 'Snow grains', icon: 'cloud-snow' },
    80: { description: 'Slight rain showers', icon: 'cloud-rain' },
    81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
    82: { description: 'Violent rain showers', icon: 'cloud-rain' },
    85: { description: 'Slight snow showers', icon: 'cloud-snow' },
    86: { description: 'Heavy snow showers', icon: 'cloud-snow' },
    95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
    96: { description: 'Thunderstorm with hail', icon: 'cloud-lightning' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
  };

  const info = weatherCodes[code] || { description: 'Unknown', icon: 'cloud' };
  return { code, ...info };
}

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit'): string {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : Math.round(temp);
  return `${value}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getDayName(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
}

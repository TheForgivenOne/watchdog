import { Droplets, Wind, Gauge, Thermometer } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCodeInfo, formatTemperature } from '../utils/helpers';
import type { CurrentWeather as CurrentWeatherType } from '../types';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  locationName: string;
  unit: 'celsius' | 'fahrenheit';
}

export function CurrentWeatherDisplay({ weather, locationName, unit }: CurrentWeatherProps) {
  const { description } = getWeatherCodeInfo(weather.weather_code);

  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{locationName}</h2>
          <p className="text-slate-400">{description}</p>
        </div>

        <div className="flex items-center gap-4">
          <WeatherIcon code={weather.weather_code} className="w-16 h-16 md:w-20 md:h-20 text-blue-400" />
          <div>
            <div className="text-5xl md:text-6xl font-bold text-white">
              {formatTemperature(weather.temperature_2m, unit)}
            </div>
            <div className="text-slate-400 text-sm">
              Feels like {formatTemperature(weather.apparent_temperature, unit)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">Humidity</span>
          </div>
          <p className="text-xl font-semibold text-white">{weather.relative_humidity_2m}%</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-sm">Wind</span>
          </div>
          <p className="text-xl font-semibold text-white">{Math.round(weather.wind_speed_10m)} km/h</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Gauge className="w-4 h-4" />
            <span className="text-sm">Pressure</span>
          </div>
          <p className="text-xl font-semibold text-white">{Math.round(weather.surface_pressure)} hPa</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm">Feels Like</span>
          </div>
          <p className="text-xl font-semibold text-white">
            {formatTemperature(weather.apparent_temperature, unit)}
          </p>
        </div>
      </div>
    </div>
  );
}

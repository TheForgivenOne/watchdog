import { WeatherIcon } from './WeatherIcon';
import { formatTemperature, getDayName } from '../utils/helpers';
import type { DailyWeather } from '../types';

interface ForecastListProps {
  daily: DailyWeather;
  unit: 'celsius' | 'fahrenheit';
}

export function ForecastList({ daily, unit }: ForecastListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">5-Day Forecast</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {daily.time.map((time, index) => (
          <div
            key={time}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center hover:border-slate-600 transition-colors"
          >
            <p className="text-slate-400 text-sm mb-2">{getDayName(time)}</p>
            
            <div className="flex justify-center mb-3">
              <WeatherIcon
                code={daily.weather_code[index]}
                className="w-10 h-10 text-blue-400"
              />
            </div>

            <div className="space-y-1">
              <p className="text-white font-semibold">
                {formatTemperature(daily.temperature_2m_max[index], unit)}
              </p>
              <p className="text-slate-500 text-sm">
                {formatTemperature(daily.temperature_2m_min[index], unit)}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <p className="text-slate-400 text-xs">
                Rain: {daily.precipitation_probability_max[index]}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

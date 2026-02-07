import { useEffect, useMemo } from 'react';
import { useCachedWeather } from '../../../cacheExports';
import { useGeolocation } from '../../../subdogs/weather/hooks/useGeolocation';
import { useWeatherStore } from '../../../subdogs/weather/store/weatherStore';
import { useConvexPreferences } from '../../hooks/useConvexPreferences';
import { useConvexLocations } from '../../../subdogs/weather/hooks/useConvexLocations';
import { useConvexRecentActivity } from '../../hooks/useConvexRecentActivity';
import { WeatherIcon } from '../../../subdogs/weather/components/WeatherIcon';
import { formatTemperature, getWeatherCodeInfo } from '../../../subdogs/weather/utils/helpers';
import { Cloud, MapPin, ExternalLink, Navigation, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import type { Doc } from '../../../../convex/_generated/dataModel';

export function WeatherWidget() {
  // Get all data first
  const { preferences } = useConvexPreferences();
  const { addLocation: addRecentLocation } = useConvexRecentActivity();
  const { locations: savedLocations } = useConvexLocations();
  const { temperatureUnit } = useWeatherStore();
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();

  // Calculate target location
  const { targetLat, targetLon, locationName, weatherWidgetMode } = useMemo(() => {
    if (!preferences || !savedLocations) {
      return { targetLat: null, targetLon: null, locationName: 'Current Location', weatherWidgetMode: 'current' };
    }

    let lat: number | null = null;
    let lon: number | null = null;
    let name = 'Current Location';
    const mode = preferences.weatherWidgetMode;

    if (mode === 'saved' && preferences.weatherWidgetLocation) {
      const savedLoc = savedLocations.find((loc: Doc<'savedLocations'>) => loc._id === preferences.weatherWidgetLocation);
      if (savedLoc) {
        lat = savedLoc.latitude;
        lon = savedLoc.longitude;
        name = savedLoc.name;
      }
    }

    // Fallback to geolocation or default
    if (lat === null) {
      if (latitude && longitude && !geoError) {
        lat = latitude;
        lon = longitude;
      } else if (savedLocations.length > 0) {
        lat = savedLocations[0].latitude;
        lon = savedLocations[0].longitude;
        name = savedLocations[0].name;
      } else {
        // Default to New York
        lat = 40.7128;
        lon = -74.006;
        name = 'New York';
      }
    }

    return { targetLat: lat, targetLon: lon, locationName: name, weatherWidgetMode: mode };
  }, [preferences, savedLocations, latitude, longitude, geoError]);

  // Fetch weather data
  const { data: weatherData, isLoading, error } = useCachedWeather(
    targetLat,
    targetLon,
    temperatureUnit
  );

  // Track location view
  useEffect(() => {
    if (targetLat && targetLon && locationName !== 'Current Location') {
      addRecentLocation({
        name: locationName,
        latitude: targetLat,
        longitude: targetLon,
      });
    }
  }, [targetLat, targetLon, locationName, addRecentLocation]);

  // Loading state for preferences/locations
  if (preferences === undefined || savedLocations === undefined) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (isLoading || geoLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky-400" />
            Weather
          </h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full" />
            <div>
              <div className="h-8 bg-slate-700 rounded w-24" />
              <div className="h-4 bg-slate-700 rounded w-32 mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky-400" />
            Weather
          </h3>
        </div>
        <p className="text-slate-400 text-sm">Unable to load weather data.</p>
        <Link
          to="/weather"
          className="mt-3 inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300"
        >
          Open Weather <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  const current = weatherData.current;
  const { description } = getWeatherCodeInfo(current.weather_code);

  return (
    <div className="bg-gradient-to-br from-sky-600/20 to-blue-600/20 border border-sky-500/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Cloud className="w-5 h-5 text-sky-400" />
          Weather
        </h3>
        <Link
          to="/weather"
          className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
        >
          Details
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <WeatherIcon code={current.weather_code} className="w-16 h-16 text-sky-400" />
        <div>
          <div className="text-4xl font-bold text-white">
            {formatTemperature(current.temperature_2m, temperatureUnit)}
          </div>
          <div className="text-slate-300 text-sm">{description}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400">
        <MapPin className="w-4 h-4" />
        <span>{locationName}</span>
        {weatherWidgetMode === 'current' && !geoError && (
          <Navigation className="w-3 h-3 text-green-400" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/50">
        <div className="text-center">
          <div className="text-slate-400 text-xs">Feels Like</div>
          <div className="text-white font-semibold">
            {formatTemperature(current.apparent_temperature, temperatureUnit)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-slate-400 text-xs">Wind</div>
          <div className="text-white font-semibold">{Math.round(current.wind_speed_10m)} km/h</div>
        </div>
      </div>
    </div>
  );
}

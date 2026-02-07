import { useState, useCallback } from 'react';
import { useConvexLocations } from '../hooks/useConvexLocations';
import { useCachedWeather } from '../../../cacheExports';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeatherStore } from '../store/weatherStore';
import { LocationSearch } from '../components/LocationSearch';
import { SavedLocations } from '../components/SavedLocations';
import { CurrentWeatherDisplay } from '../components/CurrentWeather';
import { ForecastList } from '../components/ForecastList';
import { WeatherSkeleton } from '../components/WeatherSkeleton';
import { WeatherError, LocationError } from '../components/WeatherError';
import type { SavedLocation } from '../types';

// Default location (New York)
const DEFAULT_LOCATION: SavedLocation = {
  id: '40.7128,-74.0060',
  name: 'New York',
  latitude: 40.7128,
  longitude: -74.0060,
  country: 'United States',
  admin1: 'New York',
};

export function WeatherHome() {
  // Convex for saved locations
  const { locations: savedLocations, addLocation } = useConvexLocations();
  
  // Keep temperature unit local
  const { temperatureUnit } = useWeatherStore();
  
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();

  // Determine initial location based on available data
  const getInitialLocation = (): SavedLocation => {
    if (latitude && longitude && !geoError) {
      return {
        id: `${latitude},${longitude}`,
        name: 'Current Location',
        latitude,
        longitude,
      };
    } else if (savedLocations && savedLocations.length > 0) {
      const firstLoc = savedLocations[0];
      return {
        id: firstLoc._id,
        name: firstLoc.name,
        latitude: firstLoc.latitude,
        longitude: firstLoc.longitude,
        country: firstLoc.country,
        admin1: firstLoc.admin1,
      };
    }
    return DEFAULT_LOCATION;
  };

  // Local state for current location (doesn't persist)
  const [currentLocation, setCurrentLocation] = useState<SavedLocation | null>(
    !geoLoading ? getInitialLocation() : null
  );

  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherErrorMsg,
    refetch
  } = useCachedWeather(
    currentLocation?.latitude ?? null,
    currentLocation?.longitude ?? null,
    temperatureUnit
  );

  const weatherError = !!weatherErrorMsg;

  const handleSelectLocation = useCallback(async (location: SavedLocation) => {
    setCurrentLocation(location);
    // Add to Convex saved locations
    await addLocation({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      country: location.country,
      admin1: location.admin1,
    });
  }, [addLocation]);

  const handleUseDefault = useCallback(() => {
    setCurrentLocation(DEFAULT_LOCATION);
  }, []);

  // Show loading while geolocation loads and we haven't set a location yet
  if (!currentLocation && geoLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Weather</h1>
          <p className="text-slate-400">Current conditions and forecasts</p>
        </div>
        <WeatherSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Weather</h1>
        <p className="text-slate-400">Current conditions and forecasts</p>
      </div>

      <div className="space-y-6 mb-8">
        <LocationSearch onSelectLocation={handleSelectLocation} />
        <SavedLocations 
          onSelectLocation={setCurrentLocation} 
          currentLocation={currentLocation}
        />
      </div>

      {geoError && !currentLocation && (
        <LocationError onUseDefault={handleUseDefault} />
      )}

      {weatherLoading && <WeatherSkeleton />}

      {weatherError && (
        <WeatherError
          message={weatherErrorMsg?.message || 'Failed to load weather data'}
          onRetry={() => refetch()}
        />
      )}

      {weatherData && currentLocation && (
        <div className="space-y-8">
          <CurrentWeatherDisplay
            weather={weatherData.current}
            locationName={currentLocation.name}
            unit={temperatureUnit}
          />
          <ForecastList daily={weatherData.daily} unit={temperatureUnit} />
        </div>
      )}
    </div>
  );
}

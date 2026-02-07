import { MapPin, X, Thermometer, Loader2 } from 'lucide-react';
import { useWeatherStore } from '../store/weatherStore';
import { useConvexLocations } from '../hooks/useConvexLocations';
import type { SavedLocation } from '../types';

interface SavedLocationsProps {
  onSelectLocation: (location: SavedLocation) => void;
  currentLocation: SavedLocation | null;
}

export function SavedLocations({ onSelectLocation, currentLocation }: SavedLocationsProps) {
  const { temperatureUnit, setTemperatureUnit } = useWeatherStore();
  const { locations: savedLocations, removeLocation, isLoading } = useConvexLocations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!savedLocations || savedLocations.length === 0) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">No saved locations yet. Search for a city to add one.</p>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Unit:</span>
          <button
            onClick={() => setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius')}
            className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700"
          >
            <Thermometer className="w-4 h-4" />
            {temperatureUnit === 'celsius' ? '°C' : '°F'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-300 font-medium">Saved Locations</h3>
        <button
          onClick={() => setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius')}
          className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700"
        >
          <Thermometer className="w-4 h-4" />
          {temperatureUnit === 'celsius' ? '°C' : '°F'}
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {savedLocations.map((location: import('../../../../convex/_generated/dataModel').Doc<'savedLocations'>) => (
          <div
            key={location._id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all flex-shrink-0 ${
              currentLocation?.id === location._id
                ? 'bg-blue-600/20 border-blue-500/50'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            }`}
          >
            <button
              onClick={() => onSelectLocation({
                id: location._id,
                name: location.name,
                latitude: location.latitude,
                longitude: location.longitude,
                country: location.country,
                admin1: location.admin1,
              })}
              className="flex items-center gap-2 text-left"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className={`text-sm font-medium ${currentLocation?.id === location._id ? 'text-blue-400' : 'text-white'}`}>
                {location.name}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeLocation(location._id as import('../../../../convex/_generated/dataModel').Id<'savedLocations'>);
              }}
              className="text-slate-500 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

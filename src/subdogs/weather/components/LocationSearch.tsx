import { Search, MapPin, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCachedLocationSearch } from '../../../cacheExports';
import type { SavedLocation, GeocodingResult } from '../types';

interface LocationSearchProps {
  onSelectLocation: (location: SavedLocation) => void;
}

export function LocationSearch({ onSelectLocation }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useCachedLocationSearch(query);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: GeocodingResult) => {
    const location: SavedLocation = {
      id: `${result.latitude},${result.longitude}`,
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
    };
    onSelectLocation(location);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 animate-spin" />
        )}
      </div>

      {isOpen && data?.results && data.results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {data.results.map((result) => (
            <button
              key={`${result.latitude},${result.longitude}`}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-slate-700/50 last:border-0"
            >
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{result.name}</p>
                <p className="text-slate-400 text-sm truncate">
                  {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

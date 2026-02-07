import { AlertCircle, RefreshCw, MapPin } from 'lucide-react';

interface WeatherErrorProps {
  message: string;
  onRetry?: () => void;
}

export function WeatherError({ message, onRetry }: WeatherErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Failed to load weather</h3>
      <p className="text-slate-400 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

export function LocationError({ onUseDefault }: { onUseDefault: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <MapPin className="w-12 h-12 text-slate-500 mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Location Access Denied</h3>
      <p className="text-slate-400 mb-4 max-w-md">
        We couldn't access your location. Search for a city above to see the weather.
      </p>
      <button
        onClick={onUseDefault}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
      >
        Use Default Location
      </button>
    </div>
  );
}

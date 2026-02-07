import { useAllCacheStats, useClearAllCache, useCleanupExpiredCache } from '../../../cacheExports';
import { Database, Activity, Trash2, RefreshCw } from 'lucide-react';

export function CacheStats() {
  const { news, weather, totalCached, totalValid, totalExpired } = useAllCacheStats();
  const { clearAll } = useClearAllCache();
  const { cleanup } = useCleanupExpiredCache();

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear all cached data?')) {
      console.log('Clearing all cache...');
      await clearAll();
      console.log('Cache cleared!');
      window.location.reload();
    }
  };

  const handleRefreshCache = async () => {
    console.log('Refreshing cache...');
    await cleanup();
    console.log('Cache refreshed!');
    window.location.reload();
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          Cache Statistics
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleRefreshCache}
            className="text-slate-400 hover:text-white transition-colors"
            title="Refresh cache"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClearCache}
            className="text-slate-400 hover:text-red-400 transition-colors"
            title="Clear cache"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Overall Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{totalCached}</div>
            <div className="text-xs text-slate-400">Total Cached</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{totalValid}</div>
            <div className="text-xs text-slate-400">Valid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{totalExpired}</div>
            <div className="text-xs text-slate-400">Expired</div>
          </div>
        </div>

        {/* News Cache */}
        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-white">News Cache</span>
          </div>
          {news ? (
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-slate-400 text-xs">Total</div>
                <div className="text-white font-medium">{news.newsCache.total}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Valid</div>
                <div className="text-green-400 font-medium">{news.newsCache.valid}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Expired</div>
                <div className="text-orange-400 font-medium">{news.newsCache.expired}</div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">Loading news cache stats...</div>
          )}
        </div>

        {/* Weather Cache */}
        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
            <span className="text-sm font-medium text-white">Weather Cache</span>
          </div>
          {weather ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-slate-400 text-xs">Weather</div>
                  <div className="text-white font-medium">
                    {weather.weatherCache.total}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Valid</div>
                  <div className="text-green-400 font-medium">
                    {weather.weatherCache.valid}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Expired</div>
                  <div className="text-orange-400 font-medium">
                    {weather.weatherCache.expired}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-slate-400 text-xs">Geocoding</div>
                  <div className="text-white font-medium">
                    {weather.geocodingCache.total}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Valid</div>
                  <div className="text-green-400 font-medium">
                    {weather.geocodingCache.valid}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Expired</div>
                  <div className="text-orange-400 font-medium">
                    {weather.geocodingCache.expired}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">Loading weather cache stats...</div>
          )}
        </div>

        {/* Cache Status Indicator */}
        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-400">
              Cache Status: 
              {totalExpired > 0 ? (
                <span className="text-orange-400 ml-1">Needs cleanup</span>
              ) : totalValid > 0 ? (
                <span className="text-green-400 ml-1">Healthy</span>
              ) : (
                <span className="text-slate-400 ml-1">Empty</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

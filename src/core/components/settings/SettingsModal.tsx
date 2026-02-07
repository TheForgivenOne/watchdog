import { useState } from 'react';
import { useHubStore } from '../../store/hubStore';
import { useConvexLocations } from '../../../subdogs/weather/hooks/useConvexLocations';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { X, Eye, EyeOff, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'widgets' | 'preferences'>('widgets');
  
  const {
    showNewsPreview,
    showWeatherWidget,
    showQuickActions,
    showRecentActivity,
    showStats,
    toggleWidget,
    newsPreviewCount,
    setNewsPreviewCount,
    enableAutoRedirect,
    defaultSubdog,
    setAutoRedirect,
    weatherWidgetMode,
    weatherWidgetLocation,
    setWeatherWidgetMode,
  } = useHubStore();

  const { locations: savedLocations } = useConvexLocations();

  if (!isOpen) return null;

  const widgets = [
    { id: 'NewsPreview', label: 'News Preview', enabled: showNewsPreview },
    { id: 'WeatherWidget', label: 'Weather Widget', enabled: showWeatherWidget },
    { id: 'QuickActions', label: 'Quick Actions', enabled: showQuickActions },
    { id: 'RecentActivity', label: 'Recent Activity', enabled: showRecentActivity },
    { id: 'Stats', label: 'Dashboard Stats', enabled: showStats },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Dashboard Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('widgets')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'widgets'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Widgets
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === 'widgets' && (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm mb-4">
                Toggle which widgets appear on your dashboard
              </p>
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <span className="text-white">{widget.label}</span>
                  <button
                    onClick={() => toggleWidget(widget.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      widget.enabled
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {widget.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* News Preview Count */}
              <div>
                <label className="block text-white font-medium mb-2">
                  News Headlines to Show
                </label>
                <div className="flex gap-2">
                  {[3, 4, 5].map((count) => (
                    <button
                      key={count}
                      onClick={() => setNewsPreviewCount(count)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        newsPreviewCount === count
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Redirect */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-medium">
                    Auto-redirect on Load
                  </label>
                  <button
                    onClick={() => setAutoRedirect(!enableAutoRedirect, defaultSubdog)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      enableAutoRedirect ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        enableAutoRedirect ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-slate-400 text-sm mb-3">
                  Automatically redirect to your preferred subdog
                </p>
                {enableAutoRedirect && (
                  <select
                    value={defaultSubdog || ''}
                    onChange={(e) => setAutoRedirect(true, e.target.value || null)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Select subdog...</option>
                    <option value="/news">News</option>
                    <option value="/weather">Weather</option>
                  </select>
                )}
              </div>

              {/* Weather Widget Mode */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <label className="block text-white font-medium mb-2">
                  Weather Widget Location
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="weatherMode"
                      checked={weatherWidgetMode === 'current'}
                      onChange={() => setWeatherWidgetMode('current')}
                      className="text-blue-600"
                    />
                    <span className="text-slate-300">Current location (GPS)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="weatherMode"
                      checked={weatherWidgetMode === 'saved'}
                      onChange={() => setWeatherWidgetMode('saved')}
                      className="text-blue-600"
                    />
                    <span className="text-slate-300">Saved location</span>
                  </label>
                </div>
                {weatherWidgetMode === 'saved' && (
                  <select
                    value={weatherWidgetLocation || ''}
                    onChange={(e) => setWeatherWidgetMode('saved', e.target.value || null)}
                    className="w-full mt-3 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Select location...</option>
                    {savedLocations?.map((loc: Doc<"savedLocations">) => (
                      <option key={loc._id} value={loc._id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/30">
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Open Full Settings
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useConvexPreferences } from '../hooks/useConvexPreferences';
import { useConvexLocations } from '../../subdogs/weather/hooks/useConvexLocations';
import type { Doc } from '../../../convex/_generated/dataModel';
import { 
  Settings, 
  Layout, 
  Eye, 
  EyeOff, 
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router';

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'general' | 'widgets' | 'activity'>('general');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { preferences, updatePreferences } = useConvexPreferences();
  const { locations: savedLocations } = useConvexLocations();

  // Loading state
  if (preferences === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading settings...</div>
        </div>
      </div>
    );
  }

  const widgets = [
    { id: 'NewsPreview', label: 'News Preview', description: 'Latest headlines from news subdog', enabled: preferences.showNewsPreview },
    { id: 'WeatherWidget', label: 'Weather Widget', description: 'Current weather conditions', enabled: preferences.showWeatherWidget },
    { id: 'QuickActions', label: 'Quick Actions', description: 'Shortcut buttons to subdogs', enabled: preferences.showQuickActions },
    { id: 'RecentActivity', label: 'Recent Activity', description: 'Your browsing history', enabled: preferences.showRecentActivity },
    { id: 'Stats', label: 'Dashboard Stats', description: 'Overview statistics', enabled: preferences.showStats },
  ];

  const handleToggleWidget = async (widgetId: string, currentValue: boolean) => {
    const key = `show${widgetId}` as keyof typeof preferences;
    await updatePreferences({ [key]: !currentValue });
  };

  const handleReset = async () => {
    await updatePreferences({
      showNewsPreview: true,
      showWeatherWidget: true,
      showQuickActions: true,
      showRecentActivity: true,
      showStats: true,
      newsPreviewCount: 4,
      enableAutoRedirect: false,
      defaultSubdog: undefined,
      weatherWidgetMode: 'current',
      weatherWidgetLocation: undefined,
      maxRecentItems: 10,
    });
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      {/* Navigation */}
      <div className="flex gap-1 mb-8 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'general', label: 'General', icon: Settings },
          { id: 'widgets', label: 'Widgets', icon: Layout },
          { id: 'activity', label: 'Activity', icon: RotateCcw },
        ].map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as typeof activeSection)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeSection === 'general' && (
          <div className="space-y-6">
            {/* Auto Redirect */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Default View</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-medium">Auto-redirect on Load</p>
                  <p className="text-slate-400 text-sm">Skip dashboard and go directly to your preferred subdog</p>
                </div>
                <button
                  onClick={() => updatePreferences({ enableAutoRedirect: !preferences.enableAutoRedirect })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    preferences.enableAutoRedirect ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.enableAutoRedirect ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {preferences.enableAutoRedirect && (
                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                  <label className="block text-slate-300 mb-2">Redirect to:</label>
                  <select
                    value={preferences.defaultSubdog || ''}
                    onChange={(e) => updatePreferences({ defaultSubdog: e.target.value || undefined })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select a subdog...</option>
                    <option value="/news">News</option>
                    <option value="/weather">Weather</option>
                  </select>
                </div>
              )}
            </div>

            {/* Weather Widget Settings */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Weather Widget</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-3">Location Source</label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <input
                        type="radio"
                        name="weatherMode"
                        checked={preferences.weatherWidgetMode === 'current'}
                        onChange={() => updatePreferences({ weatherWidgetMode: 'current' })}
                        className="mt-1 text-blue-600"
                      />
                      <div>
                        <span className="text-white font-medium block">Current Location</span>
                        <span className="text-slate-400 text-sm">Use your device's GPS location</span>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <input
                        type="radio"
                        name="weatherMode"
                        checked={preferences.weatherWidgetMode === 'saved'}
                        onChange={() => updatePreferences({ weatherWidgetMode: 'saved' })}
                        className="mt-1 text-blue-600"
                      />
                      <div className="flex-1">
                        <span className="text-white font-medium block">Saved Location</span>
                        <span className="text-slate-400 text-sm">Choose from your saved locations</span>
                      </div>
                    </label>
                  </div>
                </div>

                {preferences.weatherWidgetMode === 'saved' && (
                  <div className="mt-4">
                    <label className="block text-slate-300 mb-2">Select Location:</label>
                    {savedLocations && savedLocations.length > 0 ? (
                      <select
                        value={preferences.weatherWidgetLocation || ''}
                        onChange={(e) => updatePreferences({ weatherWidgetLocation: e.target.value || undefined })}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="">Choose a location...</option>
                        {savedLocations.map((loc: Doc<"savedLocations">) => (
                          <option key={loc._id} value={loc._id}>
                            {loc.name} {loc.admin1 ? `, ${loc.admin1}` : ''} {loc.country ? `(${loc.country})` : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-4 bg-slate-700/30 rounded-lg">
                        <p className="text-slate-400 text-sm">No saved locations yet.</p>
                        <Link
                          to="/weather"
                          className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block"
                        >
                          Add locations in Weather subdog →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* News Settings */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">News Preview</h3>
              
              <div>
                <label className="block text-slate-300 mb-3">Number of Headlines to Display</label>
                <div className="flex gap-3">
                  {[3, 4, 5].map((count) => (
                    <button
                      key={count}
                      onClick={() => updatePreferences({ newsPreviewCount: count })}
                      className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                        preferences.newsPreviewCount === count
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {count} headlines
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'widgets' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Widget Visibility</h3>
              <p className="text-slate-400 text-sm mb-6">
                Choose which widgets appear on your dashboard
              </p>

              <div className="space-y-3">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">{widget.label}</p>
                      <p className="text-slate-400 text-sm">{widget.description}</p>
                    </div>
                    <button
                      onClick={() => handleToggleWidget(widget.id, widget.enabled)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        widget.enabled
                          ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                          : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                      }`}
                    >
                      {widget.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span className="text-sm">{widget.enabled ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'activity' && (
          <div className="space-y-6">
            {/* Recent Activity Settings */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity History</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-300 mb-3">Maximum Items to Keep</label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={preferences.maxRecentItems}
                    onChange={(e) => updatePreferences({ maxRecentItems: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>5 items</span>
                    <span className="text-white font-medium">{preferences.maxRecentItems} items</span>
                    <span>20 items</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset to Defaults */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Reset Settings</h3>
              <p className="text-slate-400 text-sm mb-4">
                This will reset all dashboard settings to their default values. This action cannot be undone.
              </p>
              
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Defaults
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useConvexPreferences } from '../hooks/useConvexPreferences';
import { GreetingHeader } from '../components/hub/GreetingHeader';
import { NewsPreview } from '../components/hub/NewsPreview';
import { WeatherWidget } from '../components/hub/WeatherWidget';
import { QuickActions } from '../components/hub/QuickActions';
import { RecentActivity } from '../components/hub/RecentActivity';
import { DashboardStats } from '../components/hub/DashboardStats';

export function HubDashboard() {
  const { preferences } = useConvexPreferences();

  // Show loading state while preferences load
  if (preferences === undefined) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Use preferences from Convex (with defaults)
  const {
    showNewsPreview = true,
    showWeatherWidget = true,
    showQuickActions = true,
    showRecentActivity = true,
    showStats = true,
  } = preferences;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <GreetingHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left column - Weather & Quick Actions */}
        <div className="space-y-6">
          {showWeatherWidget && <WeatherWidget />}
          {showQuickActions && <QuickActions />}
        </div>

        {/* Middle/Right column - News */}
        <div className="lg:col-span-2">
          {showNewsPreview && <NewsPreview />}
        </div>
      </div>

      {/* Second row - Recent Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {showRecentActivity && (
          <div>
            <RecentActivity />
          </div>
        )}
        {showStats && (
          <div>
            <DashboardStats />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-slate-500 text-sm">
          Customize your dashboard in{' '}
          <a href="/settings" className="text-blue-400 hover:text-blue-300">
            Settings
          </a>
        </p>
      </div>
    </div>
  );
}

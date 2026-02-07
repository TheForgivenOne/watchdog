import { useCachedLatestNews } from '../../../cacheExports';
import { useConvexLocations } from '../../../subdogs/weather/hooks/useConvexLocations';
import { Newspaper, Cloud, Bookmark } from 'lucide-react';

export function DashboardStats() {
  const { data: newsData } = useCachedLatestNews();
  const { locations: savedLocations, isLoading } = useConvexLocations();

  const stats = [
    {
      label: 'Articles Available',
      value: newsData?.totalResults || 0,
      icon: Newspaper,
      color: 'blue',
    },
    {
      label: 'Saved Locations',
      value: isLoading ? '...' : (savedLocations?.length || 0),
      icon: Cloud,
      color: 'sky',
    },
    {
      label: 'Subdogs Active',
      value: 2,
      icon: Bookmark,
      color: 'purple',
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    sky: 'bg-sky-500/20 text-sky-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className={`inline-flex p-2 rounded-lg ${colorClasses[stat.color]} mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

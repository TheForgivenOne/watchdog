import { Link } from 'react-router';
import { Newspaper, Cloud, Settings, ArrowRight } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      id: 'news',
      label: 'Latest News',
      description: 'Read top headlines',
      icon: Newspaper,
      path: '/news',
      color: 'blue',
    },
    {
      id: 'weather',
      label: 'Check Weather',
      description: 'View forecasts',
      icon: Cloud,
      path: '/weather',
      color: 'sky',
    },
    {
      id: 'settings',
      label: 'Customize',
      description: 'Dashboard settings',
      icon: Settings,
      path: '/settings',
      color: 'purple',
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
    sky: 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30',
    purple: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30',
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              to={action.path}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors group"
            >
              <div className={`p-2 rounded-lg ${colorClasses[action.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                  {action.label}
                </div>
                <div className="text-slate-400 text-xs">{action.description}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { Link } from 'react-router';
import { Newspaper, Cloud, ArrowRight } from 'lucide-react';
import { subdogs } from '../utils/subdogs';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Newspaper,
  Cloud
};

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600 border-blue-500/30',
  sky: 'from-sky-500 to-sky-600 border-sky-500/30',
  green: 'from-green-500 to-green-600 border-green-500/30',
  purple: 'from-purple-500 to-purple-600 border-purple-500/30'
};

export function SubdogCard({ subdog }: { subdog: typeof subdogs[0] }) {
  const Icon = iconMap[subdog.icon] || Newspaper;
  const colorClass = colorMap[subdog.color] || colorMap.blue;

  return (
    <Link
      to={subdog.path}
      className="group block bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-between">
        {subdog.name}
        <ArrowRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </h3>
      <p className="text-slate-400 text-sm">{subdog.description}</p>
    </Link>
  );
}

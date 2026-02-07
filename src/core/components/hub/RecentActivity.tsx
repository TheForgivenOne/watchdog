import { Clock, MapPin, ExternalLink, Trash2, History, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router';
import { useConvexRecentActivity } from '../../hooks/useConvexRecentActivity';
import type { Doc } from '../../../../convex/_generated/dataModel';

export function RecentActivity() {
  const {
    recentArticles,
    recentLocations,
    clearArticles,
    clearLocations,
  } = useConvexRecentActivity();

  // Loading state
  if (recentArticles === undefined || recentLocations === undefined) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
        </div>
      </div>
    );
  }

  const hasArticles = recentArticles.length > 0;
  const hasLocations = recentLocations.length > 0;

  if (!hasArticles && !hasLocations) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          Recent Activity
        </h3>
        <p className="text-slate-400 text-sm">No recent activity yet. Start exploring!</p>
        <div className="mt-3 flex gap-2">
          <Link
            to="/news"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Browse News
          </Link>
          <span className="text-slate-600">•</span>
          <Link
            to="/weather"
            className="text-sm text-sky-400 hover:text-sky-300"
          >
            Check Weather
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          Recent Activity
        </h3>
        {(hasArticles || hasLocations) && (
          <button
            onClick={() => {
              clearArticles();
              clearLocations();
            }}
            className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-4">
        {hasArticles && (
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Articles</h4>
            <div className="space-y-2">
              {recentArticles.slice(0, 3).map((article: Doc<'recentArticles'>) => (
                <div
                  key={article._id}
                  className="flex items-start gap-2 p-2 bg-slate-700/30 rounded-lg"
                >
                  <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{article.title}</p>
                    <p className="text-slate-400 text-xs">
                      {article.source} • {formatDistanceToNow(new Date(article.viewedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasLocations && (
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Locations</h4>
            <div className="space-y-2">
              {recentLocations.slice(0, 3).map((location: Doc<'recentLocations'>) => (
                <Link
                  key={location._id}
                  to="/weather"
                  className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{location.name}</p>
                    <p className="text-slate-400 text-xs">
                      {formatDistanceToNow(new Date(location.searchedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

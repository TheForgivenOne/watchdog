import { formatDistanceToNow } from 'date-fns';
import { useCachedLatestNews } from '../../../cacheExports';
import { useHubStore } from '../../store/hubStore';
import { Newspaper, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';

export function NewsPreview() {
  const { newsPreviewCount, addRecentArticle } = useHubStore();
  const { data, isLoading, error, refetch } = useCachedLatestNews();

  const handleArticleClick = (article: {
    article_id: string;
    title: string;
    source_name: string;
  }) => {
    addRecentArticle({
      id: article.article_id,
      title: article.title,
      source: article.source_name,
      viewedAt: new Date().toISOString(),
    });
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-400" />
            Latest Headlines
          </h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: newsPreviewCount }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-700/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-400" />
            Latest Headlines
          </h3>
          <button
            onClick={() => refetch()}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <p className="text-slate-400 text-sm">Unable to load news. Try again later.</p>
      </div>
    );
  }

  const articles = data.results.slice(0, newsPreviewCount);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-400" />
          Latest Headlines
        </h3>
        <Link
          to="/news"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View All
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {articles.map((article) => (
          <a
            key={article.article_id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleArticleClick(article)}
            className="block p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group"
          >
            <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
              {article.title}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
              <span>{article.source_name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

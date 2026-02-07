import type { NewsArticle } from '../types';
import { Calendar, ExternalLink, User } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <article className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 flex flex-col h-full">
      {article.image_url ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <span className="text-slate-500 text-sm">No image</span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          {article.category?.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            {article.title}
          </a>
        </h3>

        <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
          {truncateText(article.description, 150)}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-4">
            {article.creator && article.creator.length > 0 && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {truncateText(article.creator[0], 20)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.pubDate)}
            </span>
          </div>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Read
          </a>
        </div>
      </div>
    </article>
  );
}

import type { NewsArticle } from '../types';
import { NewsCard } from './NewsCard';

interface NewsListProps {
  articles: NewsArticle[];
}

export function NewsList({ articles }: NewsListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard key={article.article_id} article={article} />
      ))}
    </div>
  );
}

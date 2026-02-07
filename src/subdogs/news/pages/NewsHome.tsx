import { useState } from 'react';
import { useCachedNews } from '../../../cacheExports';
import { NewsList } from '../components/NewsList';
import { NewsSkeleton } from '../components/NewsSkeleton';
import { NewsError } from '../components/NewsError';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import type { NewsCategory } from '../types';

export function NewsHome() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error, refetch } = useCachedNews({
    category: selectedCategory || undefined,
    query: searchQuery || undefined,
  });

  const isError = !!error;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">News</h1>
        <p className="text-slate-400">Stay informed with the latest headlines</p>
      </div>

      <div className="space-y-6 mb-8">
        <SearchBar onSearch={setSearchQuery} initialValue={searchQuery} />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {isLoading && <NewsSkeleton />}

      {isError && (
        <NewsError
          message={error?.message || 'Failed to load news'}
          onRetry={() => refetch()}
        />
      )}

      {data && <NewsList articles={data.results} />}

      {!import.meta.env.VITE_NEWSDATA_API_KEY && data && (
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm text-center">
            Using demo data. Add your{' '}
            <code className="bg-yellow-500/20 px-1 py-0.5 rounded">VITE_NEWSDATA_API_KEY</code>{' '}
            to see real news.
          </p>
        </div>
      )}
    </div>
  );
}

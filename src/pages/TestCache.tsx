import { useWorkingCachedNews } from '../hooks/useWorkingCachedNews';

export default function TestCache() {
  const { data, isLoading, error, cachedData, isCached } = useWorkingCachedNews();

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Cache Test Page</h1>
      
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Cache Status</h2>
        <div className="space-y-2 text-sm">
          <p className="text-slate-300">Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p className="text-slate-300">From Cache: {isCached ? 'Yes' : 'No'}</p>
          <p className="text-slate-300">Error: {error ? error.message : 'None'}</p>
          <p className="text-slate-300">Articles Count: {data?.results?.length || 0}</p>
          <p className="text-slate-300">Cached Data: {cachedData ? JSON.stringify(cachedData) : 'None'}</p>
        </div>
      </div>

      {data && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">News Articles</h2>
          <div className="space-y-4">
            {data.results.slice(0, 5).map((article: any) => (
              <div key={article.article_id} className="border-b border-slate-700 pb-4">
                <h3 className="text-white font-medium mb-2">{article.title}</h3>
                <p className="text-slate-400 text-sm">Source: {article.source_name}</p>
                <p className="text-slate-400 text-sm">Date: {new Date(article.pubDate).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
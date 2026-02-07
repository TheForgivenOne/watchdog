export function WeatherSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="h-8 bg-slate-700 rounded w-48 mb-2" />
            <div className="h-4 bg-slate-700 rounded w-32" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-700 rounded-full" />
            <div>
              <div className="h-12 md:h-16 bg-slate-700 rounded w-24" />
              <div className="h-4 bg-slate-700 rounded w-20 mt-2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-700/50 rounded-xl p-4">
              <div className="h-4 bg-slate-700 rounded w-20 mb-2" />
              <div className="h-6 bg-slate-700 rounded w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 bg-slate-700 rounded w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="h-4 bg-slate-700 rounded w-16 mx-auto mb-2" />
              <div className="w-10 h-10 bg-slate-700 rounded-full mx-auto mb-3" />
              <div className="h-5 bg-slate-700 rounded w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

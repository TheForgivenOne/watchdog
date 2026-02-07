export function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden animate-pulse"
        >
          <div className="aspect-video w-full bg-slate-700" />
          <div className="p-5 space-y-3">
            <div className="flex gap-2">
              <div className="w-16 h-5 bg-slate-700 rounded-full" />
              <div className="w-16 h-5 bg-slate-700 rounded-full" />
            </div>
            <div className="h-6 bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-2/3" />
            <div className="pt-4 border-t border-slate-700/50 flex justify-between">
              <div className="w-20 h-3 bg-slate-700 rounded" />
              <div className="w-20 h-3 bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

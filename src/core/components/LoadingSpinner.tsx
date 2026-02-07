import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

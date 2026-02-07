import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useHubStore } from '../../store/hubStore';
import { format } from 'date-fns';
import { Sun, Cloud, Moon } from 'lucide-react';

export function GreetingHeader() {
  const { enableAutoRedirect, defaultSubdog } = useHubStore();
  const navigate = useNavigate();

  // Get time-based greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  let icon = Sun;
  
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    icon = Cloud;
  } else if (hour >= 17 || hour < 5) {
    greeting = 'Good evening';
    icon = Moon;
  }

  const Icon = icon;

  // Handle auto-redirect
  useEffect(() => {
    if (enableAutoRedirect && defaultSubdog) {
      const timer = setTimeout(() => {
        navigate(defaultSubdog);
      }, 2000); // 2 second delay so user sees dashboard first
      return () => clearTimeout(timer);
    }
  }, [enableAutoRedirect, defaultSubdog, navigate]);

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Icon className="w-8 h-8 text-blue-400" />
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          {greeting}!
        </h1>
      </div>
      <p className="text-lg text-slate-400">
        Welcome to <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-semibold">Watchdog</span>
      </p>
      <p className="text-slate-500 text-sm mt-1">
        {format(new Date(), 'EEEE, MMMM do, yyyy')}
      </p>
      {enableAutoRedirect && defaultSubdog && (
        <p className="text-slate-500 text-xs mt-2 animate-pulse">
          Redirecting to your default view...
        </p>
      )}
    </div>
  );
}

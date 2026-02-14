import { Link, useLocation } from 'react-router';
import { Home, Newspaper, Cloud, Settings } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Hub', icon: Home },
  { path: '/news', label: 'News', icon: Newspaper },
  { path: '/weather', label: 'Weather', icon: Cloud },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

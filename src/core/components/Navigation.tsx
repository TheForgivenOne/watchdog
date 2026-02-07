import { Link, useLocation } from 'react-router';
import { Home, Newspaper, Cloud, Settings } from 'lucide-react';
import { useState } from 'react';
import { subdogs } from '../utils/subdogs';
import { SettingsModal } from './settings/SettingsModal';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Newspaper,
  Cloud
};

export function Navigation() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-white font-semibold text-lg">Watchdog</span>
            </Link>

            <div className="flex items-center space-x-1">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Hub</span>
              </Link>

              {subdogs.map((subdog) => {
                const Icon = iconMap[subdog.icon] || Home;
                return (
                  <Link
                    key={subdog.id}
                    to={subdog.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(subdog.path)
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{subdog.name}</span>
                  </Link>
                );
              })}

              {/* Settings Button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/settings')
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}

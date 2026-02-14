import { Link, useLocation } from 'react-router';
import { Home, Newspaper, Cloud, Settings, X } from 'lucide-react';
import { subdogs } from '../utils/subdogs';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Newspaper,
  Cloud
};

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Hub', icon: Home },
    ...subdogs.map(s => ({ 
      path: s.path, 
      label: s.name, 
      icon: iconMap[s.icon] || Home 
    })),
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-slate-900 border-l border-slate-700 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <span className="text-white font-semibold text-lg">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <p className="text-slate-500 text-xs text-center">
            Watchdog v1.0
          </p>
        </div>
      </div>
    </>
  );
}

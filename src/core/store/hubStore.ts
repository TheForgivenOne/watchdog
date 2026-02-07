import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecentArticle {
  id: string;
  title: string;
  source: string;
  viewedAt: string;
}

export interface RecentLocation {
  name: string;
  latitude: number;
  longitude: number;
  searchedAt: string;
}

interface HubState {
  // Widget visibility
  showNewsPreview: boolean;
  showWeatherWidget: boolean;
  showQuickActions: boolean;
  showRecentActivity: boolean;
  showStats: boolean;

  // Preferences
  newsPreviewCount: number;
  enableAutoRedirect: boolean;
  defaultSubdog: string | null;
  weatherWidgetMode: 'current' | 'saved';
  weatherWidgetLocation: string | null; // saved location ID

  // Recent activity
  recentArticles: RecentArticle[];
  recentLocations: RecentLocation[];
  maxRecentItems: number;

  // Actions
  toggleWidget: (widget: string) => void;
  setNewsPreviewCount: (count: number) => void;
  setAutoRedirect: (enabled: boolean, subdogId?: string | null) => void;
  setWeatherWidgetMode: (mode: 'current' | 'saved', locationId?: string | null) => void;
  addRecentArticle: (article: RecentArticle) => void;
  addRecentLocation: (location: RecentLocation) => void;
  clearRecentArticles: () => void;
  clearRecentLocations: () => void;
  setMaxRecentItems: (count: number) => void;
  resetToDefaults: () => void;
}

const defaultState = {
  showNewsPreview: true,
  showWeatherWidget: true,
  showQuickActions: true,
  showRecentActivity: true,
  showStats: true,
  newsPreviewCount: 4,
  enableAutoRedirect: false,
  defaultSubdog: null,
  weatherWidgetMode: 'current' as const,
  weatherWidgetLocation: null,
  recentArticles: [],
  recentLocations: [],
  maxRecentItems: 10,
};

export const useHubStore = create<HubState>()(
  persist(
    (set) => ({
      ...defaultState,

      toggleWidget: (widget) => {
        const key = `show${widget}` as keyof HubState;
        set((state) => ({
          ...state,
          [key]: !state[key],
        }));
      },

      setNewsPreviewCount: (count) => {
        set({ newsPreviewCount: Math.max(3, Math.min(5, count)) });
      },

      setAutoRedirect: (enabled, subdogId = null) => {
        set({
          enableAutoRedirect: enabled,
          defaultSubdog: enabled ? subdogId : null,
        });
      },

      setWeatherWidgetMode: (mode, locationId = null) => {
        set({
          weatherWidgetMode: mode,
          weatherWidgetLocation: mode === 'saved' ? locationId : null,
        });
      },

      addRecentArticle: (article) => {
        set((state) => {
          const filtered = state.recentArticles.filter((a) => a.id !== article.id);
          const updated = [article, ...filtered].slice(0, state.maxRecentItems);
          return { recentArticles: updated };
        });
      },

      addRecentLocation: (location) => {
        set((state) => {
          const filtered = state.recentLocations.filter(
            (l) => l.name !== location.name
          );
          const updated = [location, ...filtered].slice(0, state.maxRecentItems);
          return { recentLocations: updated };
        });
      },

      clearRecentArticles: () => {
        set({ recentArticles: [] });
      },

      clearRecentLocations: () => {
        set({ recentLocations: [] });
      },

      setMaxRecentItems: (count) => {
        set({ maxRecentItems: Math.max(5, Math.min(20, count)) });
      },

      resetToDefaults: () => {
        set(defaultState);
      },
    }),
    {
      name: 'watchdog-hub-storage',
    }
  )
);

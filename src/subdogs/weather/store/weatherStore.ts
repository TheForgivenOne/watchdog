import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TemperatureUnit } from '../types';

interface WeatherStore {
  temperatureUnit: TemperatureUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      temperatureUnit: 'celsius',
      setTemperatureUnit: (unit) => {
        set({ temperatureUnit: unit });
      },
    }),
    {
      name: 'weather-storage',
    }
  )
);

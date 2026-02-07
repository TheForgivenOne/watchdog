import { useState, useEffect, useRef } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const isFirstRender = useRef(true);
  
  const [state, setState] = useState<GeolocationState>(() => {
    // Check geolocation support during initialization
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return {
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      };
    }
    return {
      latitude: null,
      longitude: null,
      error: null,
      loading: true,
    };
  });

  useEffect(() => {
    // Skip if geolocation not supported (already handled in initial state)
    if (!navigator.geolocation) {
      return;
    }

    // Only run geolocation request once
    if (!isFirstRender.current) return;
    isFirstRender.current = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          latitude: null,
          longitude: null,
          error: error.message,
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return state;
}

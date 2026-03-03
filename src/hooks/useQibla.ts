'use client';

import { useState, useEffect, useCallback } from 'react';
import { getQiblaDirection, getDistanceToMecca } from '@/lib/qibla';
import { useApp } from '@/contexts/AppContext';

interface QiblaState {
  qiblaBearing: number | null;
  compassHeading: number | null;
  distance: number | null;
  error: string | null;
  needsPermission: boolean;
}

export function useQibla() {
  const { state } = useApp();
  const { locationLat, locationLng } = state.settings;

  const [qiblaState, setQiblaState] = useState<QiblaState>({
    qiblaBearing: null,
    compassHeading: null,
    distance: null,
    error: null,
    needsPermission: false,
  });

  // Calculate Qibla bearing from user's location
  useEffect(() => {
    if (locationLat && locationLng) {
      const bearing = getQiblaDirection(locationLat, locationLng);
      const distance = getDistanceToMecca(locationLat, locationLng);
      setQiblaState(prev => ({ ...prev, qiblaBearing: bearing, distance }));
    }
  }, [locationLat, locationLng]);

  // Device orientation for compass
  useEffect(() => {
    function handleOrientation(event: DeviceOrientationEvent) {
      // Use webkitCompassHeading for iOS, alpha for Android
      const heading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ??
        (event.alpha !== null ? (360 - event.alpha) % 360 : null);

      if (heading !== null) {
        setQiblaState(prev => ({ ...prev, compassHeading: heading, error: null }));
      }
    }

    // Check if DeviceOrientationEvent needs permission (iOS 13+)
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE.requestPermission === 'function') {
      setQiblaState(prev => ({ ...prev, needsPermission: true }));
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof DOE.requestPermission === 'function') {
        const result = await DOE.requestPermission();
        if (result === 'granted') {
          setQiblaState(prev => ({ ...prev, needsPermission: false }));
          window.addEventListener('deviceorientation', ((event: DeviceOrientationEvent) => {
            const heading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ??
              (event.alpha !== null ? (360 - event.alpha) % 360 : null);
            if (heading !== null) {
              setQiblaState(prev => ({ ...prev, compassHeading: heading }));
            }
          }) as EventListener, true);
        } else {
          setQiblaState(prev => ({
            ...prev,
            error: 'Leja për busolën u refuzua.',
            needsPermission: false,
          }));
        }
      }
    } catch {
      setQiblaState(prev => ({
        ...prev,
        error: 'Nuk mund të aksesojmë busolën.',
      }));
    }
  }, []);

  return { ...qiblaState, requestPermission };
}

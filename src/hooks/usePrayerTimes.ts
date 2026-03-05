'use client';

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { getPrayerTimes, getNextPrayerInfo, getCurrentPrayerWindow, formatTime } from '@/lib/prayer-times';
import type { PrayerWindow } from '@/lib/prayer-times';
import { PRAYER_ORDER, PRAYERS } from '@/lib/constants';
import type { PrayerId } from '@/types';

export interface PrayerTimeEntry {
  id: PrayerId;
  name_sq: string;
  time: Date;
  timeFormatted: string;
  rakats: number;
  short_label: string;
  isPassed: boolean;
  isNext: boolean;
}

export function usePrayerTimes() {
  const { state } = useApp();
  const { locationLat, locationLng } = state.settings;
  const [now, setNow] = useState(new Date());

  // Update "now" every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const times = useMemo(
    () => getPrayerTimes(locationLat, locationLng, now),
    [locationLat, locationLng, now.toDateString()]
  );

  const nextPrayer = useMemo(() => getNextPrayerInfo(times, now), [times, now]);

  const entries: PrayerTimeEntry[] = useMemo(() => {
    return PRAYER_ORDER.map((id) => {
      const prayer = PRAYERS[id];
      const time = times[id];
      const isPassed = nextPrayer ? PRAYER_ORDER.indexOf(id) < PRAYER_ORDER.indexOf(nextPrayer.id) : true;
      const isNext = nextPrayer?.id === id;

      return {
        id,
        name_sq: prayer.name_sq,
        time,
        timeFormatted: formatTime(time),
        rakats: prayer.total_rakats,
        short_label: prayer.short_label,
        isPassed,
        isNext,
      };
    });
  }, [times, nextPrayer, now]);

  // Tomorrow's Fajr
  const tomorrowTimes = useMemo(() => {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getPrayerTimes(locationLat, locationLng, tomorrow);
  }, [locationLat, locationLng, now.toDateString()]);

  const tomorrowFajr = useMemo(() => {
    if (nextPrayer) return null;
    return {
      time: tomorrowTimes.fajr,
      timeFormatted: formatTime(tomorrowTimes.fajr),
    };
  }, [nextPrayer, tomorrowTimes]);

  const currentWindow = useMemo(
    () => getCurrentPrayerWindow(times, now, tomorrowTimes.fajr),
    [times, now, tomorrowTimes]
  );

  return {
    entries,
    nextPrayer,
    tomorrowFajr,
    now,
    times,
    currentWindow,
  };
}

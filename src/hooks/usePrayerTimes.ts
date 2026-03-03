'use client';

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { getPrayerTimes, getNextPrayerInfo, formatTime } from '@/lib/prayer-times';
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

  // Tomorrow's Fajr (for display after Isha)
  const tomorrowFajr = useMemo(() => {
    if (nextPrayer) return null;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = getPrayerTimes(locationLat, locationLng, tomorrow);
    return {
      time: tomorrowTimes.fajr,
      timeFormatted: formatTime(tomorrowTimes.fajr),
    };
  }, [nextPrayer, locationLat, locationLng, now]);

  return {
    entries,
    nextPrayer,
    tomorrowFajr,
    now,
  };
}

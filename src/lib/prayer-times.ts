import { Coordinates, PrayerTimes, CalculationMethod, Madhab } from 'adhan';
import type { PrayerId } from '@/types';

export function getPrayerTimes(lat: number, lng: number, date: Date = new Date()) {
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Hanafi;
  return new PrayerTimes(coordinates, date, params);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('sq-AL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function getNextPrayerInfo(
  times: PrayerTimes,
  now: Date = new Date()
): { id: PrayerId; time: Date } | null {
  const next = times.nextPrayer(now);

  if (next === 'none' || next === 'sunrise') {
    // After isha — return null (caller handles "next prayer tomorrow")
    return null;
  }

  const prayerMap: Record<string, PrayerId> = {
    fajr: 'fajr',
    dhuhr: 'dhuhr',
    asr: 'asr',
    maghrib: 'maghrib',
    isha: 'isha',
  };

  const prayerId = prayerMap[next];
  if (!prayerId) return null;

  return {
    id: prayerId,
    time: times[next],
  };
}

export function getCurrentPrayerInfo(
  times: PrayerTimes,
  now: Date = new Date()
): PrayerId | null {
  const current = times.currentPrayer(now);
  const prayerMap: Record<string, PrayerId> = {
    fajr: 'fajr',
    dhuhr: 'dhuhr',
    asr: 'asr',
    maghrib: 'maghrib',
    isha: 'isha',
  };
  return prayerMap[current] || null;
}

export function getPrayerTimeById(times: PrayerTimes, id: PrayerId): Date {
  return times[id];
}

export function isPrayerPassed(times: PrayerTimes, id: PrayerId, now: Date = new Date()): boolean {
  const PRAYER_ORDER: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const currentIdx = PRAYER_ORDER.indexOf(id);
  const nextPrayer = getNextPrayerInfo(times, now);

  if (!nextPrayer) {
    // After isha — all prayers have passed
    return true;
  }

  const nextIdx = PRAYER_ORDER.indexOf(nextPrayer.id);
  return currentIdx < nextIdx;
}

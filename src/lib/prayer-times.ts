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

export interface PrayerWindow {
  prayer: PrayerId;
  windowStart: Date;
  windowEnd: Date;
  minutesRemaining: number;
  isAsr: boolean;
  /** true when no fard prayer window is open (between sunrise and dhuhr) */
  isGap: boolean;
  /** If isGap, the next prayer that will open */
  gapNextPrayer?: PrayerId;
  gapNextTime?: Date;
}

export function getCurrentPrayerWindow(
  times: PrayerTimes,
  now: Date,
  tomorrowFajr?: Date
): PrayerWindow | null {
  const sunrise = times.sunrise;
  const fajr = times.fajr;
  const dhuhr = times.dhuhr;
  const asr = times.asr;
  const maghrib = times.maghrib;
  const isha = times.isha;

  // Calculate midnight: midpoint between isha and tomorrow's fajr
  const midnight = tomorrowFajr
    ? new Date((isha.getTime() + tomorrowFajr.getTime()) / 2)
    : new Date(isha.getTime() + 4 * 60 * 60 * 1000); // fallback: isha + 4h

  const remaining = (end: Date) => Math.max(0, Math.round((end.getTime() - now.getTime()) / 60000));

  // Fajr window: fajr → sunrise
  if (now >= fajr && now < sunrise) {
    return { prayer: 'fajr', windowStart: fajr, windowEnd: sunrise, minutesRemaining: remaining(sunrise), isAsr: false, isGap: false };
  }

  // Gap: sunrise → dhuhr (no fard prayer)
  if (now >= sunrise && now < dhuhr) {
    return { prayer: 'dhuhr', windowStart: sunrise, windowEnd: dhuhr, minutesRemaining: remaining(dhuhr), isAsr: false, isGap: true, gapNextPrayer: 'dhuhr', gapNextTime: dhuhr };
  }

  // Dhuhr window: dhuhr → asr
  if (now >= dhuhr && now < asr) {
    return { prayer: 'dhuhr', windowStart: dhuhr, windowEnd: asr, minutesRemaining: remaining(asr), isAsr: false, isGap: false };
  }

  // Asr window: asr → maghrib
  if (now >= asr && now < maghrib) {
    return { prayer: 'asr', windowStart: asr, windowEnd: maghrib, minutesRemaining: remaining(maghrib), isAsr: true, isGap: false };
  }

  // Maghrib window: maghrib → isha
  if (now >= maghrib && now < isha) {
    return { prayer: 'maghrib', windowStart: maghrib, windowEnd: isha, minutesRemaining: remaining(isha), isAsr: false, isGap: false };
  }

  // Isha window: isha → midnight
  if (now >= isha && now < midnight) {
    return { prayer: 'isha', windowStart: isha, windowEnd: midnight, minutesRemaining: remaining(midnight), isAsr: false, isGap: false };
  }

  // After midnight or before fajr — no window
  return null;
}

/**
 * Manual adjustments for the Albanian Muslim community.
 * Change values here — they propagate everywhere automatically.
 */

/** Minutes to add to each prayer time (positive = later) */
export const PRAYER_TIME_OFFSETS: Record<string, number> = {
  fajr: 1,
  dhuhr: 5,
  asr: 3,
  maghrib: 5,
  isha: 0,
};

/**
 * Ramadan day offset for the current year.
 * Albania started Ramadan 1 day later (moon not sighted),
 * so subtract 1 from the calculated Hijri day during Ramadan.
 */
export const RAMADAN_DAY_OFFSET = -1;

/** Hijri year(s) this Ramadan offset applies to. */
export const RAMADAN_OFFSET_YEARS = [1447];

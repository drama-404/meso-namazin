import { getCurrentHijriDate as getHijri } from 'islamic-date';
import { RAMADAN_DAY_OFFSET, RAMADAN_OFFSET_YEARS } from './local-adjustments';

/**
 * Hijri date using the islamic-date package (Umm Al-Qura calendar),
 * with manual Ramadan day offset for the Albanian community.
 */
export function getCurrentHijriDate(): { day: number; month: number; year: number } {
  const result = getHijri({ calendarType: 'umm' });
  let { day, month, year } = result;

  // Apply Ramadan offset for specified years
  if (month === 9 && RAMADAN_OFFSET_YEARS.includes(year)) {
    day += RAMADAN_DAY_OFFSET;
    if (day < 1) {
      // Offset pushed before Ramadan — treat as not-yet-Ramadan (Sha'ban)
      month = 8;
      day = 30 + day; // e.g. day=0 → Sha'ban 30, day=-1 → Sha'ban 29
    }
  }

  return { day, month, year };
}

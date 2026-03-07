declare module 'islamic-date' {
  interface HijriDateResult {
    success: boolean;
    day: number;
    month: number;
    year: number;
    hijriDate: string;
    gregorianDate: string;
    monthLength: number;
    isShortMonth: boolean;
    weekday: number;
    calendarType: string;
    [key: string]: unknown;
  }

  interface HijriOptions {
    language?: string;
    calendarType?: 'umm' | 'mabims';
    dayChangeAtMidnight?: boolean;
  }

  export function getCurrentHijriDate(options?: HijriOptions): HijriDateResult;
  export function gregorianToHijri(
    year: number,
    month: number,
    day: number,
    language?: string,
    calendarType?: string
  ): HijriDateResult;
}

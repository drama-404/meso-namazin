import type { PrayerId } from '@/types';

// Default coordinates: Tirana, Albania
export const DEFAULT_LAT = 41.3275;
export const DEFAULT_LNG = 19.8187;
export const DEFAULT_LOCATION_NAME = 'Tiranë';

// Mecca coordinates (for Qibla calculation)
export const MECCA_LAT = 21.4225;
export const MECCA_LNG = 39.8262;

// Prayer definitions
export const PRAYERS: Record<PrayerId, { name_sq: string; name_ar: string; total_rakats: number; short_label: string }> = {
  fajr:    { name_sq: 'Agimi',    name_ar: 'صلاة الفجر',   total_rakats: 2, short_label: '2 rek' },
  dhuhr:   { name_sq: 'Dreka',    name_ar: 'صلاة الظهر',   total_rakats: 4, short_label: '4 rek' },
  asr:     { name_sq: 'Ikindia',  name_ar: 'صلاة العصر',   total_rakats: 4, short_label: '4 rek' },
  maghrib: { name_sq: 'Akshami',  name_ar: 'صلاة المغرب',  total_rakats: 3, short_label: '3 rek' },
  isha:    { name_sq: 'Jacia',    name_ar: 'صلاة العشاء',  total_rakats: 4, short_label: '4 rek' },
};

export const PRAYER_ORDER: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

// Albanian month names
export const ALBANIAN_MONTHS = [
  'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
  'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor',
];

// Daily tips (rotate by day)
export const DAILY_TIPS = [
  'Dije se: Namazi i Agimit (Sabahut) ka vetëm 2 rekate — është më i shkurtri!',
  'Këshillë: Fillo duke mësuar Suren Fatiha — lexohet në çdo rekat.',
  'Këshillë: Nëse gabon, mos u shqetëso. Allahu e pranon përpjekjen tënde.',
  'Dije se: Abdesi (larja para namazit) është kusht — pa abdes nuk falet namazi.',
  'Këshillë: Praktiko namazin me zë — kjo ndihmon në memorizim.',
  'Dije se: Sexhdja është momenti kur je më afër Allahut — lutu me zemër.',
  'Këshillë: Fillo me namazin e Agimit — ka vetëm 2 rekate dhe është i lehtë për tu mësuar.',
];

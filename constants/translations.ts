/**
 * Translation System for Mëso Namazin
 *
 * Structure:
 * - Albanian (sq) is the primary language
 * - English (en) is the secondary language
 *
 * Keys are organized by feature:
 * - tabs: Bottom tab navigation
 * - prayerNames: Names of the 5 daily prayers
 * - prayerTimes: Prayer times screen
 * - settings: Settings screen
 * - qibla: Qibla compass screen
 * - common: Reusable strings
 */

export type Language = 'sq' | 'en';

export type TranslationKeys = {
  // Bottom tabs
  tabs: {
    home: string;
    qibla: string;
    settings: string;
  };

  // Prayer names (5 daily prayers)
  prayerNames: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };

  // Prayer times screen (home)
  prayerTimes: {
    title: string;
    subtitle: string;
    location: string;
    nextPrayer: string;
  };

  // Settings screen
  settings: {
    title: string;
    subtitle: string;
    gender: string;
    male: string;
    female: string;
    language: string;
    albanian: string;
    english: string;
    preferences: string;
  };

  // Qibla screen
  qibla: {
    title: string;
    subtitle: string;
    direction: string;
    calibrate: string;
    pointingToMecca: string;
  };

  // Common/reusable strings
  common: {
    loading: string;
    error: string;
    retry: string;
    save: string;
    cancel: string;
    close: string;
  };
};

export const translations: Record<Language, TranslationKeys> = {
  // Albanian (Primary)
  sq: {
    tabs: {
      home: 'Namazi',
      qibla: 'Kibla',
      settings: 'Cilësimet',
    },
    prayerNames: {
      fajr: 'Agimi',
      dhuhr: 'Dreka',
      asr: 'Ikindia',
      maghrib: 'Akshami',
      isha: 'Jacia',
    },
    prayerTimes: {
      title: 'Kohët e Namazit',
      subtitle: 'Prayer Times',
      location: 'Tiranë, Shqipëri',
      nextPrayer: 'Namazi i ardhshëm',
    },
    settings: {
      title: 'Cilësimet',
      subtitle: 'Settings',
      gender: 'Gjinia',
      male: 'Mashkull',
      female: 'Femër',
      language: 'Gjuha',
      albanian: 'Shqip',
      english: 'Anglisht',
      preferences: 'Preferencat',
    },
    qibla: {
      title: 'Kibla',
      subtitle: 'Qibla Direction',
      direction: 'Drejtimi',
      calibrate: 'Kalibroni kompasun',
      pointingToMecca: 'Duke treguar nga Meka',
    },
    common: {
      loading: 'Duke u ngarkuar...',
      error: 'Gabim',
      retry: 'Provo përsëri',
      save: 'Ruaj',
      cancel: 'Anulo',
      close: 'Mbyll',
    },
  },

  // English (Secondary)
  en: {
    tabs: {
      home: 'Prayer',
      qibla: 'Qibla',
      settings: 'Settings',
    },
    prayerNames: {
      fajr: 'Fajr',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
    },
    prayerTimes: {
      title: 'Prayer Times',
      subtitle: 'Daily Prayer Schedule',
      location: 'Tirana, Albania',
      nextPrayer: 'Next Prayer',
    },
    settings: {
      title: 'Settings',
      subtitle: 'App Preferences',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      language: 'Language',
      albanian: 'Albanian',
      english: 'English',
      preferences: 'Preferences',
    },
    qibla: {
      title: 'Qibla',
      subtitle: 'Direction to Mecca',
      direction: 'Direction',
      calibrate: 'Calibrate compass',
      pointingToMecca: 'Pointing to Mecca',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
    },
  },
};

// Helper type for autocomplete in useTranslation hook
export type TranslationPath =
  | `tabs.${keyof TranslationKeys['tabs']}`
  | `prayerNames.${keyof TranslationKeys['prayerNames']}`
  | `prayerTimes.${keyof TranslationKeys['prayerTimes']}`
  | `settings.${keyof TranslationKeys['settings']}`
  | `qibla.${keyof TranslationKeys['qibla']}`
  | `common.${keyof TranslationKeys['common']}`;

// === Navigation & App State ===

export type TabId = 'sot' | 'meso' | 'duate';
export type Gender = 'male' | 'female';
export type PrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type PostureType =
  | 'standing'
  | 'standing_hands_raised'
  | 'standing_hands_folded'
  | 'bowing'
  | 'prostrating'
  | 'sitting'
  | 'salam';

// === Prayer Content ===

export interface TextSegment {
  arabic: string;
  transliteration: string;
  translation_sq: string;
  audio_key?: string | null;
}

export interface PrayerStep {
  id: string;
  order: number;
  rakat: number;
  type: PostureType;
  title_sq: string;
  instruction_sq: string;
  text_segments: TextSegment[];
  repeat?: number;
  repeat_from_segment?: number; // segments before this index play once, segments from this index repeat
  has_surah_switcher?: boolean;
  is_quran?: boolean;
  surah_number?: number;
}

export interface Prayer {
  id: PrayerId;
  name_sq: string;
  name_ar: string;
  total_rakats: number;
  fpiIndices?: number[]; // first step index of each rakat
}

// === Surahs ===

export interface Surah {
  id: string;
  title_sq: string;
  surah_number: number;
  is_quran: boolean;
  text_segments: TextSegment[];
}

// === Dhikr ===

export interface DhikrItem {
  id: string;
  title_sq: string;
  instruction_sq: string;
  repeat: number;
  text_segments: TextSegment[];
}

// === Glossary ===

export interface GlossaryEntry {
  term: string;
  definition_sq: string;
}

// === Lessons ===

export interface WuduStep {
  order: number;
  title_sq: string;
  instruction_sq: string;
  type: string;
  dua_arabic?: string;
  dua_transliteration?: string;
  dua_translation_sq?: string;
}

export interface Lesson {
  id: string;
  title_sq: string;
  description_sq: string;
  icon: string;
  coming_soon: boolean;
}

// === Onboarding ===

export interface OnboardingCard {
  id: string;
  title_sq: string;
  description_sq: string;
  type: 'welcome' | 'info' | 'setup' | 'ready';
}

// === Settings ===

export interface AppSettings {
  gender: Gender;
  locationLat: number;
  locationLng: number;
  locationName: string;
  hasCompletedOnboarding: boolean;
}

// === Daily Progress ===

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  practiced: PrayerId[];
}

// === App State ===

export interface OverlayState {
  prayerPlayer: { open: boolean; prayerId?: PrayerId };
  qibla: boolean;
  settings: boolean;
}

export interface AppState {
  activeTab: TabId;
  /** Deep-link into a specific sub-view when switching tabs */
  tabDeepLink?: string | null;
  settings: AppSettings;
  overlays: OverlayState;
}

export type AppAction =
  | { type: 'SET_TAB'; tab: TabId; deepLink?: string }
  | { type: 'CLEAR_DEEP_LINK' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'OPEN_PRAYER_PLAYER'; prayerId: PrayerId }
  | { type: 'CLOSE_PRAYER_PLAYER' }
  | { type: 'TOGGLE_QIBLA' }
  | { type: 'OPEN_SETTINGS' }
  | { type: 'CLOSE_SETTINGS' }
  | { type: 'COMPLETE_ONBOARDING' };

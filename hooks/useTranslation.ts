import { useState, useEffect } from 'react';
import { translations, Language, TranslationKeys } from '@/constants/translations';

/**
 * Translation Hook
 *
 * Provides translation function that:
 * 1. Reads current language preference
 * 2. Returns translated string for given key
 * 3. Defaults to Albanian if no preference set
 *
 * Usage:
 *   const { t, language } = useTranslation();
 *   <Text>{t('tabs.home')}</Text>  // Returns "Namazi" (if Albanian)
 */

export function useTranslation() {
  // For now, default to Albanian
  const [language, setLanguage] = useState<Language>('sq');

  /**
   * Translation function with nested key support
   *
   * @param key - Translation key in format "section.key" (e.g., "tabs.home")
   * @returns Translated string
   *
   * Examples:
   *   t('tabs.home')         → "Namazi"
   *   t('prayerNames.fajr')  → "Agimi"
   *   t('common.loading')    → "Duke u ngarkuar..."
   */
  const t = (key: string): string => {
    const keys = key.split('.');

    // Navigate through nested object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback: If key not found, return the key itself
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  /**
   * Get entire translation section
   *
   * Useful when you need multiple translations from the same section
   *
   * @param section - Section name (e.g., 'tabs', 'prayerNames')
   * @returns Object with all translations in that section
   *
   * Example:
   *   const prayerNames = getSection('prayerNames');
   *   prayerNames.fajr   → "Agimi"
   *   prayerNames.dhuhr  → "Dreka"
   */
  const getSection = <K extends keyof TranslationKeys>(
    section: K
  ): TranslationKeys[K] => {
    return translations[language][section];
  };

  /**
   * Change language (for future use)
   *
   * In Step 7, this will update InstantDB userPreferences
   */
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // TODO: Step 7 - Update InstantDB userPreferences
  };

  return {
    t,
    getSection,
    language,
    changeLanguage,
  };
}

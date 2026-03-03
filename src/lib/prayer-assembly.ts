import type { PrayerStep, PrayerId } from '@/types';
import { PRAYER_COMPONENTS } from '@/data/prayers';
import { SURAHS } from '@/data/surahs';
import { PRAYERS } from '@/lib/constants';

function makeStep(
  componentId: string,
  rakat: number,
  order: number,
  overrides?: Partial<PrayerStep>,
): PrayerStep {
  const component = PRAYER_COMPONENTS[componentId];
  return {
    id: `${componentId}_r${rakat}_${order}`,
    order,
    rakat,
    type: component.type,
    title_sq: component.title_sq,
    instruction_sq: component.instruction_sq,
    text_segments: component.text_segments,
    repeat: component.repeat,
    has_surah_switcher: component.has_surah_switcher,
    is_quran: component.is_quran,
    surah_number: component.surah_number,
    ...overrides,
  };
}

export function assemblePrayer(prayerId: PrayerId): {
  steps: PrayerStep[];
  rakatStartIndices: number[];
} {
  const totalRakats = PRAYERS[prayerId].total_rakats;
  const steps: PrayerStep[] = [];
  const rakatStartIndices: number[] = [];
  let order = 1;

  // Default surah for the short surah step
  const defaultSurah = SURAHS[0]; // al-Ihlas

  for (let rakat = 1; rakat <= totalRakats; rakat++) {
    const isFirst = rakat === 1;
    const isLast = rakat === totalRakats;
    const hasMiddleTashahhud = totalRakats >= 3 && rakat === 2;
    const isLateRakat = rakat > 2; // rakats 3-4 only have fatiha

    // Mark rakat start
    rakatStartIndices.push(steps.length);

    // === STANDING SECTION ===

    if (isFirst) {
      // Rakat 1: Niyyah → Takbir → Subhaneke → Ta'awwudh+Basmala
      steps.push(makeStep('niyyah', rakat, order++, {
        instruction_sq: `Bëj nijet me zemër: "Vendosa të fal ${PRAYERS[prayerId].name_sq} për hir të Allahut."`,
      }));
      steps.push(makeStep('takbir_iftitah', rakat, order++));
      steps.push(makeStep('subhaneke', rakat, order++));
      steps.push(makeStep('taawwudh_basmala', rakat, order++));
    } else {
      // Rakats 2+: Takbir transition to standing (from previous sujud/tashahhud)
      steps.push(makeStep('takbir_transition', rakat, order++, {
        title_sq: `Ngritja për Rekatin ${rakat}`,
        instruction_sq: `Thuaj 'Allahu Ekber' dhe ngritu për rekatin e ${rakat === 2 ? 'dytë' : rakat === 3 ? 'tretë' : 'katërt'}.`,
        type: 'standing',
      }));
      // Basmala only (no subhaneke after rakat 1)
      steps.push(makeStep('basmala', rakat, order++));
    }

    // Fatiha (every rakat)
    steps.push(makeStep('fatiha', rakat, order++, {
      title_sq: `Surja Fatiha (Rekati i ${rakat === 1 ? '1-rë' : rakat === 2 ? '2-të' : rakat === 3 ? '3-të' : '4-rt'})`,
    }));

    // Short surah only in first 2 rakats
    if (!isLateRakat) {
      steps.push(makeStep('short_surah', rakat, order++, {
        title_sq: 'Sure e shkurtër',
        text_segments: defaultSurah.text_segments,
        surah_number: defaultSurah.surah_number,
      }));
    }

    // === RUKU ===
    steps.push(makeStep('ruku', rakat, order++, {
      title_sq: `Rukuja (Rekati i ${rakat === 1 ? '1-rë' : rakat === 2 ? '2-të' : rakat === 3 ? '3-të' : '4-rt'})`,
    }));

    // Rising from Ruku
    steps.push(makeStep('rising_from_ruku', rakat, order++));

    // === FIRST SUJUD ===
    steps.push(makeStep('sujud', rakat, order++, {
      title_sq: `Sexhdja e 1-rë (Rekati i ${rakat === 1 ? '1-rë' : rakat === 2 ? '2-të' : rakat === 3 ? '3-të' : '4-rt'})`,
    }));

    // Sitting between sujuds
    steps.push(makeStep('sitting_between_sujud', rakat, order++));

    // === SECOND SUJUD ===
    steps.push(makeStep('sujud', rakat, order++, {
      id: `sujud2_r${rakat}_${order}`,
      title_sq: `Sexhdja e 2-të (Rekati i ${rakat === 1 ? '1-rë' : rakat === 2 ? '2-të' : rakat === 3 ? '3-të' : '4-rt'})`,
    }));

    // === AFTER RAKAT DECISIONS ===

    if (hasMiddleTashahhud) {
      // Middle tashahhud (only Ettehijatu, no Salavat)
      steps.push(makeStep('tashahhud', rakat, order++, {
        title_sq: 'Ettehijatu (Ulja e Mesit)',
        instruction_sq: 'Ulu dhe lexo vetëm Ettehijatun. Pastaj do të ngrihesh për rekatin tjetër.',
      }));
    }

    if (isLast) {
      // Final sitting: full Tashahhud + Salavat + Dua + Salam
      steps.push(makeStep('tashahhud', rakat, order++, {
        title_sq: 'Ettehijatu (Ulja e Fundit)',
      }));
      steps.push(makeStep('salawat', rakat, order++));
      steps.push(makeStep('dua_before_salam', rakat, order++));
      steps.push(makeStep('salam', rakat, order++));
    }
  }

  return { steps, rakatStartIndices };
}

export function getStepWithSurah(step: PrayerStep, surahId: string): PrayerStep {
  if (!step.has_surah_switcher) return step;

  const surah = SURAHS.find(s => s.id === surahId);
  if (!surah) return step;

  return {
    ...step,
    text_segments: surah.text_segments,
    surah_number: surah.surah_number,
    title_sq: surah.title_sq,
  };
}

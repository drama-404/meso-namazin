import type { DhikrItem } from '@/types';

export const AFTER_PRAYER_DHIKR: DhikrItem[] = [
  {
    id: 'istighfar',
    title_sq: 'Istigfari',
    instruction_sq: 'Thuaje 3 herë menjëherë pas selamit.',
    repeat: 3,
    text_segments: [{
      arabic: 'أَسْتَغْفِرُ اللَّهَ',
      transliteration: 'Estagfirullah',
      translation_sq: 'Kërkoj falje nga Allahu',
    }],
  },
  {
    id: 'subhanallah',
    title_sq: 'SubhanAllah',
    instruction_sq: 'Thuaje 33 herë.',
    repeat: 33,
    text_segments: [{
      arabic: 'سُبْحَانَ اللَّهِ',
      transliteration: 'SubhanAllah',
      translation_sq: 'I Lartësuar është Allahu',
    }],
  },
  {
    id: 'alhamdulillah',
    title_sq: 'Elhamdulillah',
    instruction_sq: 'Thuaje 33 herë.',
    repeat: 33,
    text_segments: [{
      arabic: 'الْحَمْدُ لِلَّهِ',
      transliteration: 'Elhamdulil-lah',
      translation_sq: 'Falënderimi i takon Allahut',
    }],
  },
  {
    id: 'allahuakbar',
    title_sq: 'Allahu Ekber',
    instruction_sq: 'Thuaje 33 herë.',
    repeat: 33,
    text_segments: [{
      arabic: 'اللَّهُ أَكْبَرُ',
      transliteration: 'Allahu Ekber',
      translation_sq: 'Allahu është më i Madhi',
    }],
  },
  {
    id: 'tahlil',
    title_sq: 'Tehlili (Mbyllja)',
    instruction_sq: 'Thuaje 1 herë në fund për të mbyllur dhikrin.',
    repeat: 1,
    text_segments: [{
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: 'La ilahe il-lallahu vahdehu la sherike leh, lehul mulku ve lehul hamdu ve huve ala kul-li shej\'in kadir',
      translation_sq: 'Nuk ka zot tjetër përveç Allahut, Një dhe i Pashoq. Atij i takon sundimi dhe falënderimi, dhe Ai ka mundësi për çdo gjë.',
    }],
  },
];

import type { Lesson, WuduStep } from '@/types';

export const LESSONS: Lesson[] = [
  {
    id: 'what-is-prayer',
    title_sq: 'Çfarë është Namazi?',
    description_sq: 'Mëso pse myslimanët falen dhe çfarë do të thotë namazi.',
    icon: 'HelpCircle',
    coming_soon: false,
  },
  {
    id: 'wudu',
    title_sq: 'Abdesi — Larja para Namazit',
    description_sq: 'Mëso si të marrësh abdes hap pas hapi.',
    icon: 'Droplets',
    coming_soon: false,
  },
  {
    id: 'prerequisites',
    title_sq: 'Kushtet e Namazit',
    description_sq: 'Çfarë duhet të plotësosh para se të falësh namazin.',
    icon: 'CheckSquare',
    coming_soon: false,
  },
  {
    id: 'prayer-steps',
    title_sq: 'Hapat e Namazit',
    description_sq: 'Pamje e përgjithshme e hapave dhe pozicioneve në namaz.',
    icon: 'ListOrdered',
    coming_soon: false,
  },
  {
    id: 'common-mistakes',
    title_sq: 'Gabimet e Zakonshme',
    description_sq: 'Mëso cilat janë gabimet më të shpeshta dhe si ti shmangësh.',
    icon: 'AlertTriangle',
    coming_soon: true,
  },
  {
    id: 'memorization',
    title_sq: 'Si të Memorizosh',
    description_sq: 'Këshilla për memorizimin e Fatihasë, sureve dhe duave.',
    icon: 'Brain',
    coming_soon: true,
  },
];

// Lesson content

export const LESSON_CONTENT: Record<string, { title_sq: string; paragraphs: string[] }> = {
  'what-is-prayer': {
    title_sq: 'Çfarë është Namazi?',
    paragraphs: [
      'Namazi është lidhja jote e drejtpërdrejtë me Allahun. Është forma më e rëndësishme e adhurimit në Islam dhe falet 5 herë në ditë.',
      'Çdo namaz përbëhet nga lëvizje të caktuara (qëndrim, përkulje, sexhde) të shoqëruara me recitim të Kuranit dhe lutje. Nuk ka nevojë për ndërmjetës — ti flet direkt me Krijuesin tënd.',
      'Namazi nuk është thjesht detyrim — është mundësi. Është momenti kur ndalon punën, stresin, dhe gjithçka tjetër, dhe i drejtohesh Allahut. Shumë myslimanë e përshkruajnë si momentin më paqësor të ditës.',
      'Mos u shqetëso nëse nuk e di si falet — pikërisht për këtë është ky aplikacion. Do të të udhëheqim hap pas hapi, me durim dhe qartësi.',
    ],
  },
  prerequisites: {
    title_sq: 'Kushtet e Namazit',
    paragraphs: [
      'Para se të falësh namazin, duhet të plotësosh disa kushte:',
    ],
  },
  'prayer-steps': {
    title_sq: 'Hapat e Namazit',
    paragraphs: [
      'Çdo namaz përbëhet nga njësi që quhen "rekate". Një rekat përfshin: qëndrimin në këmbë (kijam), përkuljen (ruku), sexhden, dhe uljen.',
      'Numri i rekateve ndryshon sipas namazit: Agimi ka 2, Dreka ka 4, Ikindia ka 4, Akshami ka 3, dhe Jacia ka 4 rekate.',
      'Kur je gati, provo namazin e parë: Agimi (2 rekate) — është më i shkurtri dhe më i lehti për tu mësuar!',
    ],
  },
};

export const PREREQUISITES_LIST = [
  { title: 'Pastërtia (Abdesi)', description: 'Duhet të jesh me abdes. Pa abdes nuk falet namazi.' },
  { title: 'Koha', description: 'Çdo namaz ka kohën e vet. Nuk mund të falësh namazin para kohës së tij.' },
  { title: 'Kibla', description: 'Duhet të drejtohesh nga Ka\'beja në Mekë gjatë faljes.' },
  { title: 'Veshja', description: 'Duhet të jesh i mbuluar siç kërkohet: meshkujt nga kërthiza deri nën gjunjë, femrat e tërë trupin përveç fytyrës dhe duarve.' },
  { title: 'Vendi', description: 'Duhet të falësh në një vend të pastër.' },
  { title: 'Nijeti', description: 'Duhet të bësh nijet (vendim) me zemër se cilin namaz do të falësh.' },
];

export const WUDU_STEPS: WuduStep[] = [
  {
    order: 1,
    title_sq: 'Nijeti',
    instruction_sq: 'Bëj nijet me zemër se po merr abdes për namaz. Thuaj \'Bismil-lah\' para se të fillosh.',
    type: 'hands',
  },
  {
    order: 2,
    title_sq: 'Larja e Duarve',
    instruction_sq: 'Laj duart deri në kyçe, 3 herë. Fillo me dorën e djathtë.',
    type: 'hands',
  },
  {
    order: 3,
    title_sq: 'Shpëlarja e Gojës',
    instruction_sq: 'Merr ujë me dorën e djathtë, shpëlaje gojën 3 herë.',
    type: 'mouth',
  },
  {
    order: 4,
    title_sq: 'Shpëlarja e Hundës',
    instruction_sq: 'Merr ujë me dorën e djathtë, fut në hundë dhe pastro me dorën e majtë, 3 herë.',
    type: 'nose',
  },
  {
    order: 5,
    title_sq: 'Larja e Fytyrës',
    instruction_sq: 'Laj fytyrën nga balli deri në mjekër dhe nga veshi në vesh, 3 herë.',
    type: 'face',
  },
  {
    order: 6,
    title_sq: 'Larja e Krahëve',
    instruction_sq: 'Laj krahun e djathtë nga gishtërinjtë deri në bërryl, 3 herë. Pastaj të njëjtën gjë me krahun e majtë.',
    type: 'arms',
  },
  {
    order: 7,
    title_sq: 'Mes\'hi i Kokës',
    instruction_sq: 'Lage dorën dhe fshije kokën nga përpara mbrapa dhe mbrapa përpara, 1 herë.',
    type: 'head',
  },
  {
    order: 8,
    title_sq: 'Mes\'hi i Veshëve',
    instruction_sq: 'Me gishtat e lagur, fshi brendësinë e veshëve me gishtat tregues dhe jashtën me gishtat e mëdhenj.',
    type: 'ears',
  },
  {
    order: 9,
    title_sq: 'Larja e Këmbëve',
    instruction_sq: 'Laj këmbën e djathtë deri mbi nyje, 3 herë. Pastaj të njëjtën gjë me këmbën e majtë.',
    type: 'feet',
  },
  {
    order: 10,
    title_sq: 'Duaja pas Abdesit',
    instruction_sq: 'Pas abdesit, thuaj shahadetin dhe duanë.',
    type: 'dua',
    dua_arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    dua_transliteration: 'Eshhedu en la ilahe il-lallahu vahdehu la sherike leh, ve eshhedu enne Muhammeden abduhu ve resuluhu',
    dua_translation_sq: 'Dëshmoj se nuk ka zot tjetër përveç Allahut, Një dhe i Pashoq, dhe dëshmoj se Muhamedi është robi dhe i Dërguari i Tij.',
  },
];

export const WUDU_BREAKERS = [
  'Dalja e gazit (djegësi)',
  'Urinimi ose kryerja e nevojave fiziologjike',
  'Gjakderdhja e shumtë',
  'Gjumi i thellë',
  'Humbja e vetëdijes',
  'Prekja e organeve gjenitale direkt (pa pengesë)',
];

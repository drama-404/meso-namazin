import type { TextSegment, PostureType } from '@/types';

export interface PrayerComponent {
  id: string;
  title_sq: string;
  instruction_sq: string;
  type: PostureType;
  text_segments: TextSegment[];
  repeat?: number;
  has_surah_switcher?: boolean;
  is_quran?: boolean;
  surah_number?: number;
}

export const PRAYER_COMPONENTS: Record<string, PrayerComponent> = {
  niyyah: {
    id: 'niyyah',
    title_sq: 'Nijeti',
    instruction_sq: 'Bëj nijet me zemër. Nijeti nuk shqiptohet me gojë, por bëhet me zemër. Vendos se cilin namaz do të falësh.',
    type: 'standing',
    text_segments: [
      {
        arabic: '',
        transliteration: '(Nijeti bëhet me zemër)',
        translation_sq: 'Vendosa të fal namazin e [emri i namazit] për hir të Allahut.',
        audio_key: null,
      },
    ],
  },

  takbir_iftitah: {
    id: 'takbir_iftitah',
    title_sq: 'Tekbiri Fillestar (Tekbiratul Ihram)',
    instruction_sq: 'Ngriti duart në lartësinë e veshëve (meshkujt) ose në lartësinë e supeve (femrat), dhe thuaj \'Allahu Ekber\'.',
    type: 'standing_hands_raised',
    text_segments: [
      {
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Ekber',
        translation_sq: 'Allahu është më i Madhi!',
        audio_key: '01-Allahu Ekber.MP3',
      },
    ],
  },

  subhaneke: {
    id: 'subhaneke',
    title_sq: 'Duaja e Hapjes (Subhaneke)',
    instruction_sq: 'Pas tekbirit, vendos dorën e djathtë mbi të majtën në gjoks. Lexo duanë e hapjes.',
    type: 'standing_hands_folded',
    text_segments: [
      {
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ',
        transliteration: 'Subhaneke Allahumme ve bihamdike',
        translation_sq: 'I Lartësuar je Ti, o Allah, dhe Ty të takon lavdërimi',
        audio_key: null,
      },
      {
        arabic: 'وَتَبَارَكَ اسْمُكَ',
        transliteration: 've tebareke ismuke',
        translation_sq: 'i bekuar është Emri Yt',
        audio_key: null,
      },
      {
        arabic: 'وَتَعَالَى جَدُّكَ',
        transliteration: 've teala xhedduke',
        translation_sq: 'e lartësuar është Madhëria Jote',
        audio_key: null,
      },
      {
        arabic: 'وَلَا إِلَهَ غَيْرُكَ',
        transliteration: 've la ilahe gajruke',
        translation_sq: 'dhe nuk ka zot tjetër përveç Teje.',
        audio_key: null,
      },
    ],
  },

  taawwudh_basmala: {
    id: 'taawwudh_basmala',
    title_sq: 'Istidheja dhe Besmelja',
    instruction_sq: 'Kërko mbrojtje nga shejtani i mallkuar, pastaj thuaj Bismil-lah.',
    type: 'standing_hands_folded',
    text_segments: [
      {
        arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        transliteration: 'Eudhu bil-lahi minesh-shejtanirr-rraxhim',
        translation_sq: 'Kërkoj mbrojtjen e Allahut nga shejtani i mallkuar',
        audio_key: '02-Eudhu bil-lahi minesh-shejtanirr-rraxhim.MP3',
      },
      {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Bismil-lahirr-Rrahmanirr-Rrahim',
        translation_sq: 'Në emër të Allahut, Mëshirëplotit, Mëshirëbërësit',
        audio_key: '03-Bismil-lahirr-Rrahmanirr-Rrahim.MP3',
      },
    ],
  },

  basmala: {
    id: 'basmala',
    title_sq: 'Besmelja',
    instruction_sq: 'Thuaj Bismil-lah para leximit të Fatihasë.',
    type: 'standing_hands_folded',
    text_segments: [
      {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Bismil-lahirr-Rrahmanirr-Rrahim',
        translation_sq: 'Në emër të Allahut, Mëshirëplotit, Mëshirëbërësit',
        audio_key: '03-Bismil-lahirr-Rrahmanirr-Rrahim.MP3',
      },
    ],
  },

  fatiha: {
    id: 'fatiha',
    title_sq: 'Surja Fatiha',
    instruction_sq: 'Lexo Suren Fatiha. Kjo sure lexohet në çdo rekat të namazit.',
    type: 'standing_hands_folded',
    is_quran: true,
    surah_number: 1,
    text_segments: [
      {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Bismil-lahirr-Rrahmanirr-Rrahim',
        translation_sq: 'Në emër të Allahut, Mëshirëplotit, Mëshirëbërësit',
        audio_key: '03-Bismil-lahirr-Rrahmanirr-Rrahim.MP3',
      },
      {
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Elhamdu lil-lahi Rabbil alemin',
        translation_sq: 'Falënderimi i takon Allahut, Zotit të botëve',
        audio_key: '04-Sure-El-Fatiha-Vargu-02.MP3',
      },
      {
        arabic: 'الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Err-Rrahmanirr-Rrahim',
        translation_sq: 'Mëshirëplotit, Mëshirëbërësit',
        audio_key: '04-Sure-El-Fatiha-Vargu-03.MP3',
      },
      {
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Maliki jevmid-din',
        translation_sq: 'Sunduesit të Ditës së Gjykimit',
        audio_key: '04-Sure-El-Fatiha-Vargu-04.MP3',
      },
      {
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'Ijjake na\'budu ve ijjake neste\'in',
        translation_sq: 'Vetëm Ty të adhurojmë dhe vetëm prej Teje ndihmë kërkojmë',
        audio_key: '04-Sure-El-Fatiha-Vargu-05.MP3',
      },
      {
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdinas-siratal mustekim',
        translation_sq: 'Udhëzona në rrugën e drejtë',
        audio_key: '04-Sure-El-Fatiha-Vargu-06.MP3',
      },
      {
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: 'Siratal-ledhine en\'amte alejhim, gajril magdubi alejhim ve led-dal-lin',
        translation_sq: 'Në rrugën e atyre që i bekove, jo të atyre që merituan zemërimin, as të atyre që humbën rrugën',
        audio_key: '04-Sure-El-Fatiha-Vargu-07.MP3',
      },
      {
        arabic: 'آمِينَ',
        transliteration: 'Amin',
        translation_sq: 'O Allah, pranoje!',
        audio_key: null,
      },
    ],
  },

  short_surah: {
    id: 'short_surah',
    title_sq: 'Sure e shkurtër',
    instruction_sq: 'Lexo një sure të shkurtër pas Fatihasë. Zgjidh njërën nga suret e mëposhtme.',
    type: 'standing_hands_folded',
    has_surah_switcher: true,
    is_quran: true,
    text_segments: [], // Filled dynamically from selected surah
  },

  ruku: {
    id: 'ruku',
    title_sq: 'Rukuja (Përkulja)',
    instruction_sq: 'Thuaj \'Allahu Ekber\' dhe përkulju duke vendosur duart mbi gjunjë. Shpina duhet të jetë e drejtë, koka në nivel me shpinën.',
    type: 'bowing',
    repeat: 3,
    text_segments: [
      {
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subhane Rabbijel Adhim',
        translation_sq: 'I Lartësuar qoftë Zoti im i Madhërishëm',
        audio_key: '06-Subhane Rabbijel Adhim.MP3',
      },
    ],
  },

  rising_from_ruku: {
    id: 'rising_from_ruku',
    title_sq: 'Ngritja nga Rukuja',
    instruction_sq: 'Ngritu nga rukuja duke thënë \'Semi Allahu limen hamideh\', pastaj thuaj \'Rabbena lekel hamd\'.',
    type: 'standing',
    text_segments: [
      {
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
        transliteration: 'Semi\'Allahu limen hamideh',
        translation_sq: 'Allahu e dëgjon atë që e falënderon',
        audio_key: '07-Semi\'Allahu limen hamideh.MP3',
      },
      {
        arabic: 'رَبَّنَا لَكَ الْحَمْدُ',
        transliteration: 'Rabbena lekel hamd',
        translation_sq: 'Zoti ynë, Ty të takon falënderimi',
        audio_key: '07-Rabbena ue lekel hamd.MP3',
      },
    ],
  },

  sujud: {
    id: 'sujud',
    title_sq: 'Sexhdja',
    instruction_sq: 'Thuaj \'Allahu Ekber\' dhe bjer në sexhde. Vendos ballin, hundën, dy duart, dy gjunjët, dhe gishtërinjtë e dy këmbëve në tokë.',
    type: 'prostrating',
    repeat: 3,
    text_segments: [
      {
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhane Rabbijel A\'la',
        translation_sq: 'I Lartësuar qoftë Zoti im, më i Larti',
        audio_key: '08-Subhane Rabbijel A\'la.MP3',
      },
    ],
  },

  sitting_between_sujud: {
    id: 'sitting_between_sujud',
    title_sq: 'Ulja midis dy Sexhdeve',
    instruction_sq: 'Ngritu nga sexhdja dhe ulu mbi këmbën e majtë. Thuaj \'Rabbigfirli\' (3 herë).',
    type: 'sitting',
    repeat: 3,
    text_segments: [
      {
        arabic: 'رَبِّ اغْفِرْ لِي',
        transliteration: 'Rabbigfirli',
        translation_sq: 'Zoti im, më fal mua',
        audio_key: '09-Rabbigfirli.MP3',
      },
    ],
  },

  tashahhud: {
    id: 'tashahhud',
    title_sq: 'Ettehijatu (Tesheh-hudi)',
    instruction_sq: 'Ulu dhe lexo Ettehijatun. Gishti tregues ngrihet kur thuhet \'Eshhedu en la ilahe il-lallah\'.',
    type: 'sitting',
    text_segments: [
      {
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
        transliteration: 'Et-tehijjatu lil-lahi ves-salavatu vet-tajjibat',
        translation_sq: 'Përshëndetjet, lutjet dhe fjalët e mira i takojnë Allahut',
        audio_key: '11-01-Et-tehijjatu lil-lahi ves-salavatu vet-tajjibat.MP3',
      },
      {
        arabic: 'السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
        transliteration: 'Es-selamu alejke ejjuhen-nebijju ve rahmetullahi ve berekatuhu',
        translation_sq: 'Paqja qoftë mbi ty, o Profet, mëshira e Allahut dhe bekimet e Tij',
        audio_key: '11-02-Es-selamu alejke ejjuhen-nebijju ve rahmetullah.MP3',
      },
      {
        arabic: 'السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ',
        transliteration: 'Es-selamu alejna ve ala ibadil-lahis-salihin',
        translation_sq: 'Paqja qoftë mbi ne dhe mbi robërit e mirë të Allahut',
        audio_key: '11-03-Es-selamu alejna ve ala ibadil-lahis-salihin.MP3',
      },
      {
        arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ',
        transliteration: 'Eshhedu en la ilahe il-lallah',
        translation_sq: 'Dëshmoj se nuk ka zot tjetër përveç Allahut',
        audio_key: '11-04-Eshhedu en la ilahe il-lallah.MP3',
      },
      {
        arabic: 'وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'Ve eshhedu enne Muhammeden abduhu ve resuluhu',
        translation_sq: 'Dhe dëshmoj se Muhamedi është robi dhe i Dërguari i Tij',
        audio_key: '11-05-Ve eshhedu enne Muhammeden abduhu ve resulu.MP3',
      },
    ],
  },

  salawat: {
    id: 'salawat',
    title_sq: 'Salavatet (Salatut Ibrahimijje)',
    instruction_sq: 'Pas Ettehijatut, lexo Salavatet mbi Profetin \uFDFA.',
    type: 'sitting',
    text_segments: [
      {
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        transliteration: 'Allahumme sal-li ala Muhamedin ve ala ali Muhamed',
        translation_sq: 'O Allah, dërgo bekime mbi Muhamedin dhe mbi familjen e Muhamedit',
        audio_key: '12-01-Allahumme sal-li ala Muhamedin ve ala ali Mu.MP3',
      },
      {
        arabic: 'كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ',
        transliteration: 'Kema sal-lejte ala Ibrahime ve ala ali Ibrahim',
        translation_sq: 'Ashtu siç dërgove bekime mbi Ibrahimin dhe familjen e Ibrahimit',
        audio_key: '12-02-Kema sal-lejte ala Ibrahime ve ala ali Ibrah.MP3',
      },
      {
        arabic: 'إِنَّكَ حَمِيدٌ مَّجِيدٌ',
        transliteration: 'Inneke hamidun mexhid',
        translation_sq: 'Vërtet, Ti je i Lavdëruari, i Madhëruari',
        audio_key: '12-03-Inneke hamidun mexhid.MP3',
      },
      {
        arabic: 'اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        transliteration: 'Allahumme barik ala Muhamedin ve ala ali Muhamed',
        translation_sq: 'O Allah, bekoje Muhamedin dhe familjen e Muhamedit',
        audio_key: '12-04-Allahumme barik ala Muhamedin ve ala ali Muh.MP3',
      },
      {
        arabic: 'كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ',
        transliteration: 'Kema barekte ala Ibrahime ve ala ali Ibrahim',
        translation_sq: 'Ashtu siç bekove Ibrahimin dhe familjen e Ibrahimit',
        audio_key: '12-05-Kema barekte ala Ibrahime ve ala ali Ibrahim.MP3',
      },
      {
        arabic: 'إِنَّكَ حَمِيدٌ مَّجِيدٌ',
        transliteration: 'Inneke hamidun mexhid',
        translation_sq: 'Vërtet, Ti je i Lavdëruari, i Madhëruari',
        audio_key: '12-06-Inneke hamidun mexhid.MP3',
      },
    ],
  },

  dua_before_salam: {
    id: 'dua_before_salam',
    title_sq: 'Duaja para Selamit',
    instruction_sq: 'Para se të japësh selam, lexo këtë dua për mbrojtje.',
    type: 'sitting',
    text_segments: [
      {
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ',
        transliteration: 'Allahumme inni eudhu bike min adhabi xhehennem',
        translation_sq: 'O Allah, kërkoj mbrojtjen Tënde nga dënimi i Xhehenemit',
        audio_key: null,
      },
      {
        arabic: 'وَمِنْ عَذَابِ الْقَبْرِ',
        transliteration: 'Ve min adhabil kabri',
        translation_sq: 'Dhe nga dënimi i varrit',
        audio_key: null,
      },
      {
        arabic: 'وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ',
        transliteration: 'Ve min fitnetil mahja vel memat',
        translation_sq: 'Dhe nga sprovat e jetës dhe vdekjes',
        audio_key: null,
      },
      {
        arabic: 'وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
        transliteration: 'Ve min sherri fitnetil mesihid-dexh-xhal',
        translation_sq: 'Dhe nga e keqja e sprovës së Dexh-xhalit',
        audio_key: null,
      },
    ],
  },

  salam: {
    id: 'salam',
    title_sq: 'Selami (Përfundimi i Namazit)',
    instruction_sq: 'Kthe kokën djathtas dhe thuaj selamin, pastaj ktheje majtas dhe përsërite.',
    type: 'salam',
    text_segments: [
      {
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'Es-selamu alejkum ve rahmetullah',
        translation_sq: 'Paqja dhe mëshira e Allahut qoftë mbi ju (djathtas)',
        audio_key: '13-Es-selamu alejkum ve rahmetullah.MP3',
      },
      {
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'Es-selamu alejkum ve rahmetullah',
        translation_sq: 'Paqja dhe mëshira e Allahut qoftë mbi ju (majtas)',
        audio_key: '13-Es-selamu alejkum ve rahmetullah.MP3',
      },
    ],
  },

  takbir_transition: {
    id: 'takbir_transition',
    title_sq: 'Tekbiri i Kalimit',
    instruction_sq: 'Thuaj \'Allahu Ekber\' duke kaluar në pozicionin tjetër.',
    type: 'standing',
    text_segments: [
      {
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Ekber',
        translation_sq: 'Allahu është më i Madhi',
        audio_key: '01-Allahu Ekber.MP3',
      },
    ],
  },
};

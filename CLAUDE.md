# CLAUDE.md — Mëso Namazin

## Project Overview
Mobile-first Progressive Web App (PWA) that teaches Albanian-speaking Muslims how to pray, step by step. Think: a patient, knowledgeable friend — not a textbook. Every screen must answer "What do I do right now?" with zero ambiguity.

**Live URL target**: Vercel  
**Stack**: Next.js 14+ (App Router) · TypeScript · Tailwind CSS · next-pwa · adhan (prayer times) · Lucide React (icons) · Framer Motion (animations)  
**Language**: Albanian only. No i18n needed.  
**No dark mode** in MVP.

---

## Design System

### Aesthetic Direction
**iOS-inspired refined minimalism.** Clean, calm, intentional. Think Apple Health or the iOS Clock app — every element has a reason to exist.

- Generous white space, soft surfaces, no harsh borders
- Subtle depth via shadows and blur, not borders
- Motion that feels native (spring physics, not linear eases)
- No emojis anywhere in the UI — use Lucide React icons or custom SVGs instead
- Typography: SF Pro feel → use `Plus Jakarta Sans` for UI (Google Fonts), `Amiri` for Arabic text

### Color Tokens (defined in `globals.css` as CSS variables)
```css
--color-primary: #1B7A4A;          /* Islamic green */
--color-primary-light: #E8F5EE;
--color-primary-gradient: linear-gradient(135deg, #1B7A4A 0%, #2A9D5C 100%);
--color-surface: #FFFFFF;
--color-background: #F2F2F7;       /* iOS system background grey */
--color-grouped-bg: #EFEFF4;       /* iOS grouped table background */
--color-separator: rgba(0,0,0,0.08);
--color-text-primary: #1C1C1E;     /* iOS label */
--color-text-secondary: #6C6C70;   /* iOS secondary label */
--color-text-tertiary: #AEAEB2;    /* iOS tertiary label */
--color-arabic: #1C1C1E;
--color-transliteration: #3A3A3C;
--color-translation: #6C6C70;
--color-blue-highlight: #007AFF;   /* iOS blue for karaoke highlight */
--color-success: #34C759;          /* iOS green */
--color-destructive: #FF3B30;      /* iOS red */
```

### Typography Scale
```css
/* Arabic */
font-family: 'Amiri', serif;
font-size: 22–26px;
direction: rtl;

/* UI headings */
font-family: 'Plus Jakarta Sans', sans-serif;
font-weight: 700;
letter-spacing: -0.02em;

/* UI body */
font-family: 'Plus Jakarta Sans', sans-serif;
font-weight: 400;
font-size: 16px;
line-height: 1.5;

/* Small labels / captions */
font-size: 12–13px;
font-weight: 500;
letter-spacing: 0.02em;
text-transform: uppercase;
color: var(--color-text-secondary);
```

### Spacing & Layout
- Max content width: `480px`, centered
- Header height: `48px`, fixed, frosted glass (`backdrop-blur-xl bg-white/80`)
- Bottom nav height: `56px` + safe area, fixed, frosted glass
- Card border-radius: `16px` (large), `12px` (medium), `8px` (small)
- Card shadow: `0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)`
- Section gap: `24px`
- Internal card padding: `20px`

### Component Patterns
- **Cards**: White surface, `rounded-2xl`, soft shadow, no border
- **Grouped lists** (iOS Settings style): Items share one card, separated by hairline dividers, not individual cards
- **Buttons (primary)**: Full-width or pill shape, green background, white text, `rounded-2xl`, `h-14`, bold text
- **Buttons (secondary)**: Transparent background, green text, no border
- **Tap states**: `active:scale-[0.97]` + `transition-transform duration-100`
- **Section headers**: Small caps, secondary color, `tracking-wider`, 12px — rendered above groups of content

### Icons
Use **Lucide React** exclusively. Never use emoji as icons. Preferred icon set:
- Navigation: `Home`, `BookOpen`, `Heart` (or `Bookmark`)
- Header: `Compass`, `Settings`
- Prayer player: `ChevronLeft`, `ChevronRight`, `X`, `Play`, `Pause`, `Volume2`, `Check`
- Lessons: `Droplets` (wudu), `CheckCircle2`, `Lock`, `Clock`, `MapPin`
- Dhikr counter: `RotateCcw`
- Completion: `CheckCircle2`
- Coming soon: `Lock`

### Motion (Framer Motion)
- **Prayer Player entrance**: `y: "100%" → y: 0`, spring `{ stiffness: 300, damping: 30 }`
- **Tab content**: `opacity: 0→1, y: 8→0`, `duration: 0.2`
- **Step transitions in player**: `x: 20→0`, `opacity: 0→1`, spring
- **Karaoke highlight**: CSS transition `background 200ms ease, border-color 200ms ease`
- **Onboarding card swipe**: Framer Motion drag with `dragConstraints`
- **Dhikr counter tap**: `scale: 1 → 0.94 → 1`, spring, very fast

---

## File Structure
```
meso-namazin/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── AppShell.tsx
│   │   ├── tabs/
│   │   │   ├── SotTab.tsx
│   │   │   ├── MesoTab.tsx
│   │   │   └── DuateTab.tsx
│   │   ├── prayer-player/
│   │   │   ├── PrayerPlayer.tsx
│   │   │   ├── StepCard.tsx
│   │   │   ├── RakatProgress.tsx
│   │   │   ├── SurahSwitcher.tsx
│   │   │   ├── CompletionScreen.tsx
│   │   │   └── postures/
│   │   │       ├── Standing.tsx
│   │   │       ├── Bowing.tsx
│   │   │       ├── Prostrating.tsx
│   │   │       └── Sitting.tsx
│   │   ├── qibla/QiblaCompass.tsx
│   │   ├── settings/SettingsPanel.tsx
│   │   ├── onboarding/Onboarding.tsx
│   │   └── ui/
│   │       ├── DhikrCounter.tsx
│   │       └── ComingSoonCard.tsx
│   ├── contexts/
│   │   ├── AppContext.tsx
│   │   └── PrayerPlayerContext.tsx
│   ├── data/
│   │   ├── prayers.ts
│   │   ├── surahs.ts
│   │   ├── dhikr.ts
│   │   ├── glossary.ts
│   │   ├── lessons.ts
│   │   └── daily-tips.ts
│   ├── hooks/
│   │   ├── usePrayerTimes.ts
│   │   ├── useCountdown.ts
│   │   ├── useAudio.ts
│   │   ├── useGeolocation.ts
│   │   ├── useQibla.ts
│   │   └── useDailyProgress.ts
│   └── lib/
│       ├── prayer-times.ts
│       ├── prayer-assembly.ts
│       ├── audio.ts
│       ├── qibla.ts
│       └── constants.ts
├── public/
│   ├── manifest.json
│   ├── icons/
│   ├── illustrations/        ← posture images (men + women)
│   └── audio/                ← local audio files (if bundled)
├── .claude/
│   └── skills/
│       ├── frontend-design/
│       └── theme-factory/
├── CLAUDE.md
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Assets

### Illustrations

Located at: `public/illustrations/` (flat folder, no men/women subfolders)

Naming convention: `{step-no}_{posture}_{context}_man.png` — suffixed `_man` for male, `_woman` for female (women's set coming later).

**Full file list (men):**
```
01_standing_niyyah_man.png         ← intention, standing at rest
02_standing_takbeer_man.png        ← hands raised to ears (takbir)
03_standing_qiyam_man.png          ← hands folded on chest (recitation posture)
04_bowing_ruku_man.png             ← bowing, hands on knees
05_standing_after_ruku_man.png     ← standing upright after ruku
06_prostration_sujud_man.png       ← forehead on ground
07_sitting_between_sujood_man.png  ← sitting between two prostrations
08_standing_tashahud_man.png       ← sitting for tashahhud (named with step number)
09_salam_right_man.png             ← head turned right for salam
10_salam_left_man.png              ← head turned left for salam
```

**Mapping from prayer step `type` to illustration filename** (used in `PostureIllustration` component):
```typescript
const ILLUSTRATION_MAP: Record<string, { male: string; female: string }> = {
  'standing':              { male: '01_standing_niyyah_man.png',        female: '01_standing_niyyah_woman.png' },
  'standing_hands_raised': { male: '02_standing_takbeer_man.png',       female: '02_standing_takbeer_woman.png' },
  'standing_hands_folded': { male: '03_standing_qiyam_man.png',         female: '03_standing_qiyam_woman.png' },
  'bowing':                { male: '04_bowing_ruku_man.png',            female: '04_bowing_ruku_woman.png' },
  'standing_after_ruku':   { male: '05_standing_after_ruku_man.png',    female: '05_standing_after_ruku_woman.png' },
  'prostrating':           { male: '06_prostration_sujud_man.png',      female: '06_prostration_sujud_woman.png' },
  'sitting':               { male: '07_sitting_between_sujood_man.png', female: '07_sitting_between_sujood_woman.png' },
  'sitting_tashahhud':     { male: '08_standing_tashahud_man.png',      female: '08_standing_tashahud_woman.png' },
  'salam_right':           { male: '09_salam_right_man.png',            female: '09_salam_right_woman.png' },
  'salam_left':            { male: '10_salam_left_man.png',             female: '10_salam_left_woman.png' },
};
```

Gender is read from `SettingsContext`. Until women's illustrations are added, always fall back to male files.  
Fallback: If image fails to load, show a minimal inline SVG silhouette (no broken image icon).

---

### Audio

All audio files are **local**, located at `public/audio/`. They are served as static assets — no external API calls for prayer audio.

**Key design principle**: Files are **not duplicated per rakat**. One file covers all occurrences. For example, `01-Allahu Ekber.mp3` plays every time a takbir is said, regardless of which rakat or transition it belongs to. The audio system looks up the file by `audio_key` on each step/segment.

**Naming convention**: `{step-no}-{description}.mp3`  
- Single dhikr: `{step-no}-{transliteration}.mp3` — e.g., `01-Allahu Ekber.mp3`  
- Surah verse: `{step-no}-Sure-El-{SurahName}-Vargu-{verse-no}.mp3` — e.g., `04-Sure-El-Fatiha-Vargu-02.mp3`  
- Multi-segment dua: `{step-no}-{segment-no}-{transliteration}.mp3` — e.g., `11-01-Et-tehijjatu lil-lahi ves-salavatu vet-tajjibat.mp3`

**Complete audio file inventory:**
```
01-Allahu Ekber.mp3
02-Eudhu bil-lahi minesh-shejtanirr-rraxhim.mp3
03-Bismil-lahirr-Rrahmanirr-Rrahim.mp3
04-Sure-El-Fatiha-Vargu-02.mp3
04-Sure-El-Fatiha-Vargu-03.mp3
04-Sure-El-Fatiha-Vargu-04.mp3
04-Sure-El-Fatiha-Vargu-05.mp3
04-Sure-El-Fatiha-Vargu-06.mp3
04-Sure-El-Fatiha-Vargu-07.mp3
05-Sure-El-Ikhlas-Vargu-01.mp3
05-Sure-El-Ikhlas-Vargu-02.mp3
05-Sure-El-Ikhlas-Vargu-03.mp3
05-Sure-El-Ikhlas-Vargu-04.mp3
06-Subhane Rabbijel Adhim.mp3
07-Semi'Allahu limen hamideh.mp3
07-Rabbena ue lekel hamd.mp3
08-Subhane Rabbijel A'la.mp3
09-Rabbigfirli.mp3
10-Sure-El-Felek-Vargu-01.mp3
10-Sure-El-Felek-Vargu-02.mp3
10-Sure-El-Felek-Vargu-03.mp3
10-Sure-El-Felek-Vargu-04.mp3
10-Sure-El-Felek-Vargu-05.mp3
11-01-Et-tehijjatu lil-lahi ves-salavatu vet-tajjibat.mp3
11-02-Es-selamu alejke ejjuhen-nebijju ve rahmetullah.mp3
11-03-Es-selamu alejna ve ala ibadil-lahis-salihin.mp3
11-04-Eshhedu en la ilahe il-lallah.mp3
11-05-Ve eshhedu enne Muhammeden abduhu ve resulu.mp3
12-01-Allahumme sal-li ala Muhamedin ve ala ali Mu.mp3
12-02-Kema sal-lejte ala Ibrahime ve ala ali Ibrah.mp3
12-03-Inneke hamidun mexhid.mp3
12-04-Allahumme barik ala Muhamedin ve ala ali Muh.mp3
12-05-Kema barekte ala Ibrahime ve ala ali Ibrahim.mp3
12-06-Inneke hamidun mexhid.mp3
13-Es-selamu alejkum ve rahmetullah.mp3
```

**Notes on gaps:**  
- Fatiha verse 1 (Bismillah) = file `03-Bismil-lahirr-Rrahmanirr-Rrahim.mp3` (shared with basmala). Fatiha verse playback starts at Vargu-02.  
- Subhaneke (opening dua), Surah Nas, Surah Kawthar, Surah Kafirun, and Dua before Salam files may exist in the folder but were not visible in the provided screenshot — **list `public/audio/` directory at the start of any audio integration work** to get the complete file list before writing the audio map.
- For any step that has no local audio file yet, show a muted `Volume2` icon (Lucide, `text-[#AEAEB2]`) — no text label needed.

**`audio_key` field on `TextSegment`:**  
Each `TextSegment` in the data layer carries an `audio_key: string | null` pointing to its filename (without path, with extension). The audio hook resolves this to `/audio/{audio_key}`. Example:

```typescript
// In prayers.ts data
{ arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Ekber", ..., audio_key: "01-Allahu Ekber.mp3" }
{ arabic: "الْحَمْدُ لِلَّهِ...",  transliteration: "Elhamdu lil-lahi...", ..., audio_key: "04-Sure-El-Fatiha-Vargu-02.mp3" }
{ arabic: "رَبِّ اغْفِرْ لِي", transliteration: "Rabbigfirli", ..., audio_key: "06-Subhane Rabbijel Adhim.mp3", repeat: 3 }
```

**Playback logic in Listen mode:**
1. Collect all `audio_key` values for the current step's `text_segments` (in order)
2. Play them sequentially using an audio queue
3. As each file plays, highlight the matching segment (karaoke effect)
4. For repeated dhikr (`repeat: 3`), play the single file N times before advancing
5. After the last segment audio ends, auto-advance to the next step

---

## Core Logic Rules

### Prayer Assembly
`assemblePrayer(prayerId, totalRakats)` builds the full step array:
- Rakat 1: niyyah → takbir → subhaneke → ta'awwudh+basmala → fatiha → short surah (with switcher) → ruku → rising → sujud × 2 (with sitting between)
- Rakat 2+: basmala → fatiha → [short surah only if rakat ≤ 2] → ruku → rising → sujud × 2
- After rakat 2 (if totalRakats ≥ 3): partial tashahhud (no salavat)
- Final rakat: full tashahhud → salavat → dua before salam → salam

### Prayer Times
```typescript
import { PrayerTimes, CalculationMethod, Coordinates, Madhab } from 'adhan';
const params = CalculationMethod.MuslimWorldLeague();
params.madhab = Madhab.Hanafi;
// Default: Tirana (41.3275, 19.8187) if GPS unavailable
```

### Daily Progress
```typescript
// localStorage key: 'daily-progress'
// Shape: { date: 'YYYY-MM-DD', practiced: string[] }
// Auto-reset when date changes
// Mark practiced when user reaches CompletionScreen
```

### Qibla
Use `adhan`'s built-in `Qibla(coordinates)` for bearing. Combine with `DeviceOrientationEvent` for live compass. Fallback: static bearing in degrees with text label.

---

## Conventions & Rules

1. **Mobile-first always.** Design for 375px width. Tap targets minimum 44px.
2. **No emojis.** Use Lucide icons or SVG only.
3. **No dark mode** — light theme only in this version.
4. **Albanian language only.** All user-facing strings in Albanian. See `UI_STRINGS` constant in `src/lib/constants.ts`.
5. **Arabic text** must always use `<span dir="rtl" lang="ar">` with Amiri font.
6. **Offline first.** Prayer content is bundled (never fetched). Audio is cached after first fetch.
7. **Performance.** Use `next/dynamic` for QiblaCompass and PrayerPlayer. Lazy-load Mëso and Duatë tab content.
8. **localStorage** for: settings (gender, location, onboarding-complete), daily progress, practiced prayers.
9. **Error handling.** GPS fail → Tirana default. Audio fail → silent fallback to Practice mode.
10. **No Redux/Zustand.** React Context + useReducer only.
11. **Framer Motion** for all meaningful transitions. CSS transitions for micro-interactions (hover, active states).
12. **Prayer Player is a portal.** Full-viewport fixed overlay with `z-50`. Bottom nav hidden when player is open.
13. **Read `.claude/skills/frontend-design/` and `.claude/skills/theme-factory/`** before any significant UI work.

---

## Albanian UI Strings
All strings live in `src/lib/constants.ts` under `UI_STRINGS`. Never hardcode Albanian text in components — always reference this object.

Key labels:
- Tabs: Sot / Mëso / Duatë
- Prayer names: Agimi / Dreka / Ikindia / Akshami / Jacia
- Player modes: Dëgjo / Praktiko
- CTA: "Fillo Praktikën" / "Hapi Tjetër" / "Kthehu në Kryefaqe"
- Completion: "Allahu e pranoftë namazin tënd!"
- Coming soon: "Së shpejti"
- Close: "Mbyll"

---

## Prayer Content Accuracy Note
All Arabic text, transliterations, and Albanian translations must be reviewed by an Islamic scholar before public release. The content provided is accurate to best ability but religious accuracy is paramount.
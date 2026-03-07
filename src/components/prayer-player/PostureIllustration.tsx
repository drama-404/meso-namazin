'use client';

import { useState } from 'react';
import Image from 'next/image';

const ILLUSTRATION_MAP: Record<string, { male: string; female: string }> = {
  'standing':              { male: '01_standing_niyyah_man.png',        female: '01_standing_niyyah_woman.png' },
  'standing_hands_raised': { male: '02_standing_takbeer_man.png',       female: '02_standing_takbeer_woman.png' },
  'standing_hands_folded': { male: '03_standing_qiyam_man.png',         female: '03_standing_qiyam_woman.png' },
  'bowing':                { male: '04_bowing_ruku_man.png',            female: '04_bowing_ruku_woman.png' },
  'standing_after_ruku':   { male: '05_standing_after_ruku_man.png',    female: '05_standing_after_ruku_woman.png' },
  'prostrating':           { male: '06_prostration_sujud_man.png',      female: '06_prostration_sujud_woman.png' },
  'sitting':               { male: '07_sitting_between_sujood_man.png', female: '07_sitting_between_sujood_woman.png' },
  'sitting_tashahhud':     { male: '07_sitting_between_sujood_man.png', female: '07_sitting_between_sujood_woman.png' },
  'salam':                 { male: '09_salam_right_man.png',            female: '09_salam_right_woman.png' },
  'salam_right':           { male: '09_salam_right_man.png',            female: '09_salam_right_woman.png' },
  'salam_left':            { male: '10_salam_left_man.png',             female: '10_salam_left_woman.png' },
};

// Minimal SVG fallback silhouette
function FallbackSilhouette() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="60" height="100" viewBox="0 0 60 100" fill="none" className="text-[#AEAEB2]">
        <circle cx="30" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="26" x2="30" y2="60" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="36" x2="15" y2="50" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="36" x2="45" y2="50" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="60" x2="18" y2="85" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="60" x2="42" y2="85" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function PostureIllustration({ type, gender = 'male' }: { type: string; gender?: 'male' | 'female' }) {
  const [hasError, setHasError] = useState(false);
  const entry = ILLUSTRATION_MAP[type] ?? ILLUSTRATION_MAP['standing'];
  const filename = gender === 'female' ? entry.female : entry.male;
  const folder = gender === 'female' ? 'woman' : 'man';

  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-visible">
      {hasError ? (
        <FallbackSilhouette />
      ) : (
        <Image
          src={`/illustrations/${folder}/${filename}`}
          alt={type}
          width={200}
          height={200}
          className="object-contain max-h-48"
          onError={() => setHasError(true)}
          priority={false}
        />
      )}
    </div>
  );
}

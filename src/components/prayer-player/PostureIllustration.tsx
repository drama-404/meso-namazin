'use client';

import { useState } from 'react';
import Image from 'next/image';

const ILLUSTRATION_MAP: Record<string, { male: string; female: string }> = {
  'standing':              { male: '01_standing_niyyah_man.jpg',        female: '01_standing_niyyah_man.jpg' },
  'standing_hands_raised': { male: '02_standing_takbeer_man.jpg',       female: '02_standing_takbeer_man.jpg' },
  'standing_hands_folded': { male: '03_standing_qiyam_man.jpg',         female: '03_standing_qiyam_man.jpg' },
  'bowing':                { male: '04_bowing_ruku_man.jpg',            female: '04_bowing_ruku_man.jpg' },
  'standing_after_ruku':   { male: '05_standing_after_ruku_man.jpg',    female: '05_standing_after_ruku_man.jpg' },
  'prostrating':           { male: '06_prostration_sujud_man.jpg',      female: '06_prostration_sujud_man.jpg' },
  'sitting':               { male: '07_sitting_between_sujood_man.jpeg', female: '07_sitting_between_sujood_man.jpeg' },
  'sitting_tashahhud':     { male: '08_standing_tashahud_man.jpg',      female: '08_standing_tashahud_man.jpg' },
  'salam':                 { male: '09_salam_right_man.jpg',            female: '09_salam_right_man.jpg' },
  'salam_right':           { male: '09_salam_right_man.jpg',            female: '09_salam_right_man.jpg' },
  'salam_left':            { male: '10_salam_left_man.jpg',             female: '10_salam_left_man.jpg' },
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

  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-visible">
      {hasError ? (
        <FallbackSilhouette />
      ) : (
        <Image
          src={`/illustrations/man/${filename}`}
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

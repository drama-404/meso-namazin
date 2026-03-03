'use client';

import { SURAHS } from '@/data/surahs';

interface SurahSwitcherProps {
  selectedSurahId: string;
  onSelect: (surahId: string) => void;
}

export default function SurahSwitcher({ selectedSurahId, onSelect }: SurahSwitcherProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
      {SURAHS.map((surah) => {
        const isSelected = surah.id === selectedSurahId;
        return (
          <button
            key={surah.id}
            onClick={() => onSelect(surah.id)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all active:scale-[0.97] ${
              isSelected
                ? 'bg-[#1B7A4A] text-white'
                : 'bg-[#EFEFF4] text-[#6C6C70]'
            }`}
          >
            {surah.title_sq}
          </button>
        );
      })}
    </div>
  );
}

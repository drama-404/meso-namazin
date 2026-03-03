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
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              isSelected
                ? 'bg-primary text-white'
                : 'bg-surface-alt text-text-secondary hover:bg-border'
            }`}
          >
            {surah.title_sq}
          </button>
        );
      })}
    </div>
  );
}

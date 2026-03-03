'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import type { DhikrItem } from '@/types';

interface DhikrCounterProps {
  item: DhikrItem;
  onComplete?: () => void;
}

export default function DhikrCounter({ item, onComplete }: DhikrCounterProps) {
  const [count, setCount] = useState(0);
  const isComplete = count >= item.repeat;
  const progress = Math.min(count / item.repeat, 1);

  function handleTap() {
    if (isComplete) return;
    const next = count + 1;
    setCount(next);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    if (next >= item.repeat) {
      onComplete?.();
    }
  }

  function handleReset() {
    setCount(0);
  }

  const segment = item.text_segments[0];

  return (
    <div className="bg-white rounded-2xl card-shadow p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[#1C1C1E]">{item.title_sq}</h3>
          <p className="text-[12px] text-[#AEAEB2]">{item.instruction_sq}</p>
        </div>
        {count > 0 && (
          <button onClick={handleReset} className="p-1.5 text-[#AEAEB2] active:scale-[0.97] transition-transform">
            <RotateCcw size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Arabic + transliteration */}
      <div className="mb-4 text-center">
        {segment.arabic && (
          <p className="arabic-text text-2xl text-[#1C1C1E] mb-1">{segment.arabic}</p>
        )}
        <p className="text-[14px] text-[#6C6C70]">{segment.transliteration}</p>
        <p className="text-[12px] text-[#AEAEB2] italic mt-0.5">{segment.translation_sq}</p>
      </div>

      {/* Tap counter */}
      <motion.button
        onClick={handleTap}
        disabled={isComplete}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 600, damping: 20 }}
        className={`w-full relative overflow-hidden rounded-2xl py-6 transition-all ${
          isComplete
            ? 'bg-[#E8F5EE] text-[#1B7A4A]'
            : 'bg-[#1B7A4A] text-white'
        }`}
      >
        {/* Progress bar background */}
        {!isComplete && (
          <div
            className="absolute inset-0 bg-[#15613B]/30 transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        )}
        <div className="relative flex flex-col items-center">
          <span className="text-3xl font-bold tabular-nums">
            {count}
          </span>
          <span className="text-[14px] opacity-80">
            {isComplete ? 'Përfunduar!' : `nga ${item.repeat}`}
          </span>
        </div>
      </motion.button>
    </div>
  );
}

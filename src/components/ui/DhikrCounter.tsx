'use client';

import { useState } from 'react';
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
    // Haptic feedback
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
    <div className="bg-surface rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{item.title_sq}</h3>
          <p className="text-xs text-text-muted">{item.instruction_sq}</p>
        </div>
        {count > 0 && (
          <button onClick={handleReset} className="p-1.5 text-text-muted hover:text-text-secondary">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Arabic + transliteration */}
      <div className="mb-4 text-center">
        {segment.arabic && (
          <p className="arabic-text text-2xl text-foreground mb-1">{segment.arabic}</p>
        )}
        <p className="text-sm text-text-secondary">{segment.transliteration}</p>
        <p className="text-xs text-text-muted italic mt-0.5">{segment.translation_sq}</p>
      </div>

      {/* Tap counter */}
      <button
        onClick={handleTap}
        disabled={isComplete}
        className={`w-full relative overflow-hidden rounded-xl py-6 transition-all active:scale-[0.98] ${
          isComplete
            ? 'bg-primary/10 text-primary'
            : 'bg-primary text-white'
        }`}
      >
        {/* Progress bar background */}
        {!isComplete && (
          <div
            className="absolute inset-0 bg-primary-dark/30 transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        )}
        <div className="relative flex flex-col items-center">
          <span className="text-3xl font-bold tabular-nums">
            {count}
          </span>
          <span className="text-sm opacity-80">
            {isComplete ? 'Përfunduar!' : `nga ${item.repeat}`}
          </span>
        </div>
      </button>
    </div>
  );
}

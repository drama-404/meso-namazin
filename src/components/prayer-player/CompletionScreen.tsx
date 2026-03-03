'use client';

import { PRAYERS } from '@/lib/constants';
import type { PrayerId } from '@/types';

interface CompletionScreenProps {
  prayerId: PrayerId;
  onClose: () => void;
}

export default function CompletionScreen({ prayerId, onClose }: CompletionScreenProps) {
  const prayer = PRAYERS[prayerId];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <div className="text-6xl mb-6">🤲</div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Allahu e pranoftë namazin tënd!
      </h2>
      <p className="text-text-secondary mb-8">
        Ke përfunduar Namazin e {prayer.name_sq}s ({prayer.total_rakats} rekate)
      </p>
      <button
        onClick={onClose}
        className="bg-primary text-white font-semibold py-3.5 px-8 rounded-xl active:scale-[0.98] transition-transform"
      >
        Kthehu në Kryefaqe
      </button>
    </div>
  );
}

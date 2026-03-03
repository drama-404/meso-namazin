'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
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
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <CheckCircle2 size={72} strokeWidth={1.5} className="text-[#34C759]" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-2xl font-bold text-[#1C1C1E] mb-2 mt-6"
      >
        Allahu e pranoftë namazin tënd!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="text-[#6C6C70] mb-8"
      >
        Ke përfunduar Namazin e {prayer.name_sq}s ({prayer.total_rakats} rekate)
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        onClick={onClose}
        className="bg-[#1B7A4A] text-white font-bold py-3.5 px-8 rounded-2xl active:scale-[0.97] transition-transform h-14"
      >
        Kthehu në Kryefaqe
      </motion.button>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Home, BookOpen, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { TabId } from '@/types';

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'sot', label: 'Sot', icon: Home },
  { id: 'meso', label: 'Mëso', icon: BookOpen },
  { id: 'duate', label: 'Duatë', icon: Heart },
];

export default function BottomNav() {
  const { state, dispatch } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 frosted-glass safe-bottom" style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
      <div className="flex items-center justify-around h-14 max-w-[480px] mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = state.activeTab === id;
          return (
            <motion.button
              key={id}
              onClick={() => dispatch({ type: 'SET_TAB', tab: id })}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 600, damping: 20 }}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-[#1B7A4A]' : 'text-[#AEAEB2]'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

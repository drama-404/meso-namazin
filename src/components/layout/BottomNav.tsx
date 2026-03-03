'use client';

import { Sun, BookOpen, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { TabId } from '@/types';

const tabs: { id: TabId; label: string; icon: typeof Sun }[] = [
  { id: 'sot', label: 'Sot', icon: Sun },
  { id: 'meso', label: 'Mëso', icon: BookOpen },
  { id: 'duate', label: 'Duatë', icon: Heart },
];

export default function BottomNav() {
  const { state, dispatch } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = state.activeTab === id;
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: 'SET_TAB', tab: id })}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

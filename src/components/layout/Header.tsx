'use client';

import { Compass, Settings } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function Header() {
  const { dispatch } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border safe-top">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕌</span>
          <h1 className="text-lg font-bold text-primary">Mëso Namazin</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_QIBLA' })}
            className="p-2.5 rounded-full hover:bg-primary-light transition-colors"
            aria-label="Kibla"
          >
            <Compass className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={() => dispatch({ type: 'OPEN_SETTINGS' })}
            className="p-2.5 rounded-full hover:bg-primary-light transition-colors"
            aria-label="Cilësimet"
          >
            <Settings className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
}

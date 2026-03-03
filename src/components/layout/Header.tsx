'use client';

import { Compass, Settings } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function Header() {
  const { dispatch } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 frosted-glass safe-top" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
      <div className="flex items-center justify-between h-12 px-4 max-w-[480px] mx-auto">
        <h1 className="text-[17px] font-bold text-[#1C1C1E] tracking-[-0.02em]">
          Mëso Namazin
        </h1>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_QIBLA' })}
            className="p-2.5 rounded-full active:scale-[0.97] transition-transform active:bg-[#EFEFF4]"
            aria-label="Kibla"
          >
            <Compass size={20} strokeWidth={1.5} className="text-[#1B7A4A]" />
          </button>
          <button
            onClick={() => dispatch({ type: 'OPEN_SETTINGS' })}
            className="p-2.5 rounded-full active:scale-[0.97] transition-transform active:bg-[#EFEFF4]"
            aria-label="Cilësimet"
          >
            <Settings size={20} strokeWidth={1.5} className="text-[#6C6C70]" />
          </button>
        </div>
      </div>
    </header>
  );
}

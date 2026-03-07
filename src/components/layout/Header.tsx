'use client';

import { MapPin, Settings } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function Header() {
  const { state, dispatch } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 frosted-glass safe-top" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
      <div className="flex items-center justify-between h-12 px-4 max-w-[480px] mx-auto">
        <h1 className="text-[17px] font-bold text-[#1C1C1E] tracking-[-0.02em]">
          Mëso Namazin
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[#6C6C70]">
            <MapPin size={14} strokeWidth={2} />
            <span className="text-[12px] font-medium">{state.settings.locationName}</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'OPEN_SETTINGS' })}
            className="flex items-center gap-1 p-1.5 rounded-full active:scale-[0.97] transition-transform active:bg-[#EFEFF4]"
            aria-label="Cilësimet"
          >
            <Settings size={18} strokeWidth={1.5} className="text-[#6C6C70]" />
            <span className="text-[12px] font-medium text-[#6C6C70]">Cilësimet</span>
          </button>
        </div>
      </div>
    </header>
  );
}

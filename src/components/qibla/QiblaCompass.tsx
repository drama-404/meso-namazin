'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useQibla } from '@/hooks/useQibla';

export default function QiblaCompass() {
  const { state, dispatch } = useApp();
  const { qiblaBearing, compassHeading, distance, error, needsPermission, requestPermission } = useQibla();

  if (!state.overlays.qibla) return null;

  const hasCompass = compassHeading !== null;
  const arrowRotation = hasCompass && qiblaBearing !== null
    ? qiblaBearing - compassHeading
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-50 bg-[#F2F2F7] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 frosted-glass safe-top" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_QIBLA' })}
            className="p-2 -ml-2 active:scale-[0.97] transition-transform"
          >
            <X size={20} strokeWidth={1.5} className="text-[#6C6C70]" />
          </button>
          <h2 className="text-[15px] font-semibold text-[#1C1C1E]">Kibla</h2>
          <div className="w-9" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {needsPermission ? (
            <div className="text-center">
              <p className="text-[#6C6C70] mb-4">
                Na duhet leja e busolës për të treguar drejtimin e Kiblës.
              </p>
              <button
                onClick={requestPermission}
                className="bg-[#1B7A4A] text-white font-bold py-3 px-6 rounded-2xl active:scale-[0.97] transition-transform h-12"
              >
                Lejo Busolën
              </button>
            </div>
          ) : (
            <>
              {/* Compass Circle */}
              <div className="relative w-72 h-72 mb-8">
                {/* Outer ring */}
                <div
                  className="w-full h-full rounded-full border-[3px] border-[rgba(0,0,0,0.08)] relative"
                  style={{
                    transform: hasCompass ? `rotate(${-compassHeading}deg)` : 'none',
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  {/* Cardinal directions */}
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[13px] font-bold text-[#FF3B30]">V</span>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[13px] font-bold text-[#AEAEB2]">J</span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#AEAEB2]">L</span>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#AEAEB2]">P</span>

                  {/* Degree markers */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <div
                      key={deg}
                      className="absolute top-0 left-1/2 h-full w-px"
                      style={{ transform: `rotate(${deg}deg)`, transformOrigin: 'center' }}
                    >
                      <div className={`w-px h-3 mx-auto ${deg % 90 === 0 ? 'bg-[#1C1C1E]' : 'bg-[rgba(0,0,0,0.08)]'}`} />
                    </div>
                  ))}
                </div>

                {/* Qibla Arrow */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: hasCompass ? `rotate(${arrowRotation}deg)` : `rotate(${qiblaBearing || 0}deg)`,
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  <div className="flex flex-col items-center">
                    {/* Arrow pointing up */}
                    <svg width="40" height="100" viewBox="0 0 40 100" className="text-[#1B7A4A] -mb-12">
                      <polygon points="20,0 4,50 20,40 36,50" fill="currentColor" />
                      <rect x="17" y="40" width="6" height="55" rx="3" fill="currentColor" opacity="0.3" />
                    </svg>
                    {/* Kaaba icon (SVG instead of emoji) */}
                    <div className="w-10 h-10 bg-[#1B7A4A] rounded-lg flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <rect x="4" y="6" width="16" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4 6L12 2L20 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <rect x="10" y="12" width="4" height="8" rx="0.5" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#1B7A4A] rounded-full" />
                </div>
              </div>

              {/* Info text */}
              <p className="text-center text-[#1C1C1E] font-medium mb-2">
                Drejtohu në këtë drejtim për tu falur.
              </p>
              {qiblaBearing !== null && (
                <p className="text-[14px] text-[#6C6C70] text-center">
                  Kibla: {Math.round(qiblaBearing)}&deg; nga Veriu
                </p>
              )}
              {distance !== null && (
                <p className="text-[14px] text-[#AEAEB2] text-center mt-1">
                  Distanca deri në Mekë: {distance.toLocaleString()} km
                </p>
              )}
              {!hasCompass && (
                <p className="text-[12px] text-[#D4A574] text-center mt-4 px-4">
                  Busola nuk është e disponueshme në këtë pajisje. Shigjeta tregon drejtimin bazuar në vendndodhjen tënde.
                </p>
              )}
              {error && (
                <p className="text-[12px] text-[#FF3B30] text-center mt-2">{error}</p>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

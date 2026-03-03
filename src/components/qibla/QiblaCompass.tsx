'use client';

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
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-surface safe-top">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_QIBLA' })}
          className="p-2 -ml-2 text-text-secondary"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-base font-semibold text-foreground">Kibla</h2>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {needsPermission ? (
          <div className="text-center">
            <p className="text-text-secondary mb-4">
              Na duhet leja e busolës për të treguar drejtimin e Kiblës.
            </p>
            <button
              onClick={requestPermission}
              className="bg-primary text-white font-semibold py-3 px-6 rounded-xl"
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
                className="w-full h-full rounded-full border-4 border-border relative"
                style={{
                  transform: hasCompass ? `rotate(${-compassHeading}deg)` : 'none',
                  transition: 'transform 0.3s ease-out',
                }}
              >
                {/* Cardinal directions */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-danger">V</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-text-muted">J</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-text-muted">L</span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold text-text-muted">P</span>

                {/* Degree markers */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <div
                    key={deg}
                    className="absolute top-0 left-1/2 h-full w-px"
                    style={{ transform: `rotate(${deg}deg)`, transformOrigin: 'center' }}
                  >
                    <div className={`w-px h-3 mx-auto ${deg % 90 === 0 ? 'bg-foreground' : 'bg-border'}`} />
                  </div>
                ))}
              </div>

              {/* Qibla Arrow (stays fixed relative to screen, rotates by bearing) */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: hasCompass ? `rotate(${arrowRotation}deg)` : `rotate(${qiblaBearing || 0}deg)`,
                  transition: 'transform 0.3s ease-out',
                }}
              >
                <div className="flex flex-col items-center">
                  {/* Arrow pointing up */}
                  <svg width="40" height="100" viewBox="0 0 40 100" className="text-primary -mb-12">
                    <polygon points="20,0 4,50 20,40 36,50" fill="currentColor" />
                    <rect x="17" y="40" width="6" height="55" rx="3" fill="currentColor" opacity="0.3" />
                  </svg>
                  {/* Kaaba icon */}
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-lg">
                    🕋
                  </div>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full" />
              </div>
            </div>

            {/* Info text */}
            <p className="text-center text-foreground font-medium mb-2">
              Drejtohu në këtë drejtim për tu falur.
            </p>
            {qiblaBearing !== null && (
              <p className="text-sm text-text-secondary text-center">
                Kibla: {Math.round(qiblaBearing)}° nga Veriu
              </p>
            )}
            {distance !== null && (
              <p className="text-sm text-text-muted text-center mt-1">
                Distanca deri në Mekë: {distance.toLocaleString()} km
              </p>
            )}
            {!hasCompass && (
              <p className="text-xs text-accent-warm text-center mt-4 px-4">
                Busola nuk është e disponueshme në këtë pajisje. Shigjeta tregon drejtimin bazuar në vendndodhjen tënde.
              </p>
            )}
            {error && (
              <p className="text-xs text-danger text-center mt-2">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

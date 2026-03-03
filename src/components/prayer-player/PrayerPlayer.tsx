'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, Hand } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { assemblePrayer, getStepWithSurah } from '@/lib/prayer-assembly';
import { PRAYERS } from '@/lib/constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import StepCard from './StepCard';
import RakatProgress from './RakatProgress';
import SurahSwitcher from './SurahSwitcher';
import CompletionScreen from './CompletionScreen';
import type { PrayerId, DailyProgress } from '@/types';

type Mode = 'practice' | 'listen';

export default function PrayerPlayer() {
  const { state, dispatch } = useApp();
  const { prayerPlayer } = state.overlays;
  const prayerId = prayerPlayer.prayerId as PrayerId;

  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<Mode>('practice');
  const [selectedSurahId, setSelectedSurahId] = useState('ikhlas');
  const [completed, setCompleted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const todayKey = new Date().toISOString().split('T')[0];
  const [progress, setProgress] = useLocalStorage<DailyProgress>(
    'meso-namazin-progress',
    { date: todayKey, practiced: [] }
  );

  // Reset state when prayer changes
  useEffect(() => {
    setCurrentStep(0);
    setCompleted(false);
    setMode('practice');
  }, [prayerId]);

  const { steps, rakatStartIndices } = useMemo(() => {
    if (!prayerId) return { steps: [], rakatStartIndices: [] };
    return assemblePrayer(prayerId);
  }, [prayerId]);

  // Apply surah selection to steps that have the switcher
  const processedSteps = useMemo(() => {
    return steps.map(step =>
      step.has_surah_switcher ? getStepWithSurah(step, selectedSurahId) : step
    );
  }, [steps, selectedSurahId]);

  const prayer = prayerId ? PRAYERS[prayerId] : null;
  const totalSteps = processedSteps.length;
  const step = processedSteps[currentStep];

  // Which rakat the current step belongs to
  const currentRakat = step?.rakat || 1;

  // Scroll to top when step changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Mark as completed
      setCompleted(true);
      if (prayerId) {
        setProgress(prev => {
          const currentProgress = prev.date === todayKey ? prev : { date: todayKey, practiced: [] as PrayerId[] };
          if (!currentProgress.practiced.includes(prayerId)) {
            return { ...currentProgress, practiced: [...currentProgress.practiced, prayerId] };
          }
          return currentProgress;
        });
      }
    }
  }, [currentStep, totalSteps, prayerId, todayKey, setProgress]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToRakat = useCallback((rakat: number) => {
    const index = rakatStartIndices[rakat - 1];
    if (index !== undefined) {
      setCurrentStep(index);
    }
  }, [rakatStartIndices]);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_PRAYER_PLAYER' });
  }, [dispatch]);

  if (!prayerPlayer.open || !prayerId || !prayer) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-slide-up">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-surface safe-top flex-shrink-0">
        <button onClick={handleClose} className="p-2 -ml-2 text-text-secondary">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-semibold text-foreground">
            {prayer.name_sq}
          </h2>
          <p className="text-xs text-text-muted">
            {prayer.total_rakats} Rekate
          </p>
        </div>
        <span className="text-xs text-text-muted tabular-nums w-10 text-right">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>

      {!completed ? (
        <>
          {/* Mode Toggle */}
          <div className="px-4 py-2 flex gap-2 bg-surface border-b border-border flex-shrink-0">
            <button
              onClick={() => setMode('listen')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'listen' ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              Dëgjo
            </button>
            <button
              onClick={() => setMode('practice')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'practice' ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary'
              }`}
            >
              <Hand className="w-4 h-4" />
              Praktiko
            </button>
          </div>

          {/* Rakat Progress */}
          <div className="px-4 bg-surface border-b border-border flex-shrink-0">
            <RakatProgress
              totalRakats={prayer.total_rakats}
              currentRakat={currentRakat}
              onRakatTap={goToRakat}
            />
          </div>

          {/* Surah Switcher (only shown on surah steps) */}
          {step?.has_surah_switcher && (
            <div className="px-4 py-2 bg-surface border-b border-border flex-shrink-0">
              <SurahSwitcher
                selectedSurahId={selectedSurahId}
                onSelect={setSelectedSurahId}
              />
            </div>
          )}

          {/* Step Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-4">
            {step && (
              <StepCard
                step={step}
                stepNumber={currentStep + 1}
                totalSteps={totalSteps}
                isActive
              />
            )}
          </div>

          {/* Navigation Footer */}
          <div className="px-4 py-3 border-t border-border bg-surface safe-bottom flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                disabled={currentStep === 0}
                className={`flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  currentStep === 0
                    ? 'text-text-muted bg-surface-alt'
                    : 'text-text-secondary bg-surface-alt active:bg-border'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Mbrapa
              </button>
              <button
                onClick={goNext}
                className="flex-1 flex items-center justify-center gap-1 bg-primary text-white py-3 rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform"
              >
                {currentStep === totalSteps - 1 ? 'Përfundo' : 'Hapi Tjetër'}
                {currentStep < totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </>
      ) : (
        <CompletionScreen prayerId={prayerId} onClose={handleClose} />
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

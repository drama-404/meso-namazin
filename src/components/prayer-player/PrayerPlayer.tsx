'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  useEffect(() => {
    setCurrentStep(0);
    setCompleted(false);
    setMode('practice');
  }, [prayerId]);

  const { steps, rakatStartIndices } = useMemo(() => {
    if (!prayerId) return { steps: [], rakatStartIndices: [] };
    return assemblePrayer(prayerId);
  }, [prayerId]);

  const processedSteps = useMemo(() => {
    return steps.map(step =>
      step.has_surah_switcher ? getStepWithSurah(step, selectedSurahId) : step
    );
  }, [steps, selectedSurahId]);

  const prayer = prayerId ? PRAYERS[prayerId] : null;
  const totalSteps = processedSteps.length;
  const step = processedSteps[currentStep];
  const currentRakat = step?.rakat || 1;

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
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
    <AnimatePresence>
      {prayerPlayer.open && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-50 bg-[#F2F2F7] flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 h-12 frosted-glass safe-top flex-shrink-0" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
            <button onClick={handleClose} className="p-2 -ml-2 active:scale-[0.97] transition-transform">
              <X size={20} strokeWidth={1.5} className="text-[#6C6C70]" />
            </button>
            <div className="text-center">
              <h2 className="text-[15px] font-semibold text-[#1C1C1E]">
                {prayer.name_sq}
              </h2>
              <p className="text-[11px] text-[#AEAEB2]">
                {prayer.total_rakats} Rekate
              </p>
            </div>
            <span className="text-[12px] text-[#AEAEB2] tabular-nums w-10 text-right font-medium">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>

          {!completed ? (
            <>
              {/* Mode Toggle */}
              <div className="px-4 py-2.5 flex gap-2 bg-white flex-shrink-0" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <button
                  onClick={() => setMode('listen')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[13px] font-semibold transition-all active:scale-[0.97] ${
                    mode === 'listen'
                      ? 'bg-[#1B7A4A] text-white'
                      : 'bg-[#EFEFF4] text-[#6C6C70]'
                  }`}
                >
                  <Volume2 size={16} strokeWidth={1.5} />
                  Dëgjo
                </button>
                <button
                  onClick={() => setMode('practice')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[13px] font-semibold transition-all active:scale-[0.97] ${
                    mode === 'practice'
                      ? 'bg-[#1B7A4A] text-white'
                      : 'bg-[#EFEFF4] text-[#6C6C70]'
                  }`}
                >
                  <Hand size={16} strokeWidth={1.5} />
                  Praktiko
                </button>
              </div>

              {/* Rakat Progress */}
              <div className="px-4 bg-white flex-shrink-0" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <RakatProgress
                  totalRakats={prayer.total_rakats}
                  currentRakat={currentRakat}
                  onRakatTap={goToRakat}
                />
              </div>

              {/* Surah Switcher */}
              {step?.has_surah_switcher && (
                <div className="px-4 py-2 bg-white flex-shrink-0" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                  <SurahSwitcher
                    selectedSurahId={selectedSurahId}
                    onSelect={setSelectedSurahId}
                  />
                </div>
              )}

              {/* Step Content with animation */}
              <div ref={contentRef} className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  {step && (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    >
                      <StepCard
                        step={step}
                        stepNumber={currentStep + 1}
                        totalSteps={totalSteps}
                        isActive
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Footer */}
              <div className="px-4 py-3 frosted-glass safe-bottom flex-shrink-0" style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div className="flex items-center gap-3 max-w-[480px] mx-auto">
                  <button
                    onClick={goPrev}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-1 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all active:scale-[0.97] ${
                      currentStep === 0
                        ? 'text-[#AEAEB2] bg-[#EFEFF4]'
                        : 'text-[#6C6C70] bg-[#EFEFF4] active:bg-[#E5E5EA]'
                    }`}
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                    Mbrapa
                  </button>
                  <button
                    onClick={goNext}
                    className="flex-1 flex items-center justify-center gap-1 bg-[#1B7A4A] text-white py-3 rounded-2xl text-[14px] font-bold active:scale-[0.97] transition-transform h-12"
                  >
                    {currentStep === totalSteps - 1 ? 'Përfundo' : 'Hapi Tjetër'}
                    {currentStep < totalSteps - 1 && <ChevronRight size={16} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <CompletionScreen prayerId={prayerId} onClose={handleClose} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

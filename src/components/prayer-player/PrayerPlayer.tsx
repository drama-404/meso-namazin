'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { assemblePrayer, getStepWithSurah } from '@/lib/prayer-assembly';
import { PRAYERS } from '@/lib/constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAudio } from '@/hooks/useAudio';
import StepSection from './StepSection';
import SurahSwitcher from './SurahSwitcher';
import CompletionScreen from './CompletionScreen';
import type { PrayerId, DailyProgress } from '@/types';

export default function PrayerPlayer() {
  const { state, dispatch } = useApp();
  const { prayerPlayer } = state.overlays;
  const prayerId = prayerPlayer.prayerId as PrayerId;

  const [selectedSurahId, setSelectedSurahId] = useState('ikhlas');
  const [completed, setCompleted] = useState(false);
  const [currentRakatDisplay, setCurrentRakatDisplay] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepSectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoScrollEnabled = useRef(true);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmaticScrollRef = useRef(false);
  const lastActiveStepRef = useRef(-1);

  const todayKey = new Date().toISOString().split('T')[0];
  const [, setProgress] = useLocalStorage<DailyProgress>(
    'meso-namazin-progress',
    { date: todayKey, practiced: [] }
  );

  useEffect(() => {
    setCompleted(false);
    setSelectedSurahId('ikhlas');
    setCurrentRakatDisplay(1);
    lastActiveStepRef.current = -1;
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

  // Compute segment offsets per step for global ref indexing
  const segmentOffsets = useMemo(() => {
    const offsets: number[] = [];
    let total = 0;
    processedSteps.forEach(step => {
      offsets.push(total);
      total += step.text_segments.length;
    });
    segmentRefs.current = new Array(total).fill(null);
    return offsets;
  }, [processedSteps]);

  // Auto-scroll to active segment
  // For the first segment of a new step: scroll to the step section top (shows illustration + segment)
  // For subsequent segments: scroll to just the segment at ~30% from top
  const handleSegmentActivate = useCallback((stepIndex: number, segmentIndex: number) => {
    if (!autoScrollEnabled.current) return;

    requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const isNewStep = stepIndex !== lastActiveStepRef.current;
      lastActiveStepRef.current = stepIndex;

      let targetEl: HTMLElement | null = null;

      if (isNewStep && segmentIndex === 0) {
        // First segment of a new step — scroll to show the step section top (illustration visible)
        targetEl = stepSectionRefs.current[stepIndex];
      } else {
        // Subsequent segments — scroll to the segment
        const globalIdx = segmentOffsets[stepIndex] + segmentIndex;
        targetEl = segmentRefs.current[globalIdx];
      }

      if (targetEl) {
        const elRect = targetEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        // For step top: position near the top (just below header)
        // For segments: position at ~30% from top
        const targetOffset = (isNewStep && segmentIndex === 0)
          ? 4 // just below scroll container top
          : containerRect.height * 0.3;
        const scrollDelta = elRect.top - containerRect.top - targetOffset;

        if (Math.abs(scrollDelta) > 5) {
          programmaticScrollRef.current = true;
          container.scrollBy({ top: scrollDelta, behavior: 'smooth' });
          setTimeout(() => {
            programmaticScrollRef.current = false;
          }, 600);
        }
      }
    });
  }, [segmentOffsets]);

  const handlePrayerComplete = useCallback(() => {
    // Audio finished all steps
  }, []);

  const { isPlaying, activeStepIndex, activeSegmentIndex, play, pause, resume, stop, seekToSegment } =
    useAudio({
      steps: processedSteps,
      onSegmentActivate: handleSegmentActivate,
      onPrayerComplete: handlePrayerComplete,
    });

  // Handle manual scroll
  const handleScroll = useCallback(() => {
    if (programmaticScrollRef.current) return;
    if (isPlaying) {
      autoScrollEnabled.current = false;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        autoScrollEnabled.current = true;
      }, 3000);
    }
  }, [isPlaying]);

  // Re-enable auto-scroll when playback starts
  useEffect(() => {
    if (isPlaying) {
      autoScrollEnabled.current = true;
    }
  }, [isPlaying]);

  // Track current rakat based on active step
  useEffect(() => {
    if (activeStepIndex >= 0) {
      const step = processedSteps[activeStepIndex];
      if (step) {
        setCurrentRakatDisplay(step.rakat);
      }
    }
  }, [activeStepIndex, processedSteps]);

  const handleClose = useCallback(() => {
    stop();
    dispatch({ type: 'CLOSE_PRAYER_PLAYER' });
  }, [dispatch, stop]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else if (activeStepIndex >= 0) {
      resume();
    } else {
      play();
    }
  }, [isPlaying, activeStepIndex, play, pause, resume]);

  // Tap on segment → seek audio there
  const handleSegmentTap = useCallback((stepIndex: number, segmentIndex: number) => {
    autoScrollEnabled.current = true;
    seekToSegment(stepIndex, segmentIndex);
  }, [seekToSegment]);

  // Scroll to prev/next step section
  const scrollToStepHeader = useCallback((direction: 'prev' | 'next') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const headerEls = stepSectionRefs.current.filter(Boolean) as HTMLDivElement[];
    const containerTop = container.getBoundingClientRect().top;

    programmaticScrollRef.current = true;
    if (direction === 'next') {
      const next = headerEls.find(el => el.getBoundingClientRect().top > containerTop + 10);
      if (next) {
        const offset = next.getBoundingClientRect().top - containerTop;
        container.scrollBy({ top: offset, behavior: 'smooth' });
      }
    } else {
      const reversed = [...headerEls].reverse();
      const prev = reversed.find(el => el.getBoundingClientRect().top < containerTop - 10);
      if (prev) {
        const offset = prev.getBoundingClientRect().top - containerTop;
        container.scrollBy({ top: offset, behavior: 'smooth' });
      }
    }
    setTimeout(() => { programmaticScrollRef.current = false; }, 600);
  }, []);

  const handleComplete = useCallback(() => {
    stop();
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
  }, [prayerId, todayKey, setProgress, stop]);

  if (!prayerPlayer.open || !prayerId || !prayer) return null;

  return (
    <AnimatePresence>
      {prayerPlayer.open && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-50 bg-white flex flex-col"
        >
          {completed ? (
            <>
              <div
                className="flex items-center justify-between px-4 frosted-glass safe-top flex-shrink-0"
                style={{ height: '44px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}
              >
                <button onClick={handleClose} className="p-2 -ml-2 active:scale-[0.97] transition-transform">
                  <X size={20} strokeWidth={1.5} className="text-[#6C6C70]" />
                </button>
                <span className="text-[15px] font-semibold text-[#1C1C1E]">{prayer.name_sq}</span>
                <div className="w-10" />
              </div>
              <CompletionScreen prayerId={prayerId} onClose={handleClose} />
            </>
          ) : (
            <>
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 frosted-glass safe-top flex-shrink-0 relative z-20"
                style={{ height: '44px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}
              >
                <button onClick={handleClose} className="p-2 -ml-2 active:scale-[0.97] transition-transform">
                  <X size={20} strokeWidth={1.5} className="text-[#6C6C70]" />
                </button>
                <div className="text-center">
                  <span className="text-[15px] font-semibold text-[#1C1C1E]">
                    {prayer.name_sq}
                  </span>
                  <span className="text-[13px] text-[#6C6C70] ml-2">
                    Rekati {currentRakatDisplay} nga {prayer.total_rakats}
                  </span>
                </div>
                <div className="w-10" />
              </div>

              {/* Scroll container — no rakat dividers, steps flow directly */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto scrollbar-hide bg-white"
              >
                {processedSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    ref={(el) => { stepSectionRefs.current[idx] = el; }}
                  >
                    <StepSection
                      step={step}
                      stepIndex={idx}
                      isFirstInRakat={rakatStartIndices.includes(idx)}
                      rakatNumber={step.rakat}
                      totalRakats={prayer.total_rakats}
                      activeStepIndex={activeStepIndex}
                      activeSegmentIndex={activeSegmentIndex}
                      segmentRefs={segmentRefs}
                      segmentRefOffset={segmentOffsets[idx] || 0}
                      onSegmentTap={handleSegmentTap}
                      gender={state.settings.gender}
                      surahSwitcher={
                        step.has_surah_switcher ? (
                          <SurahSwitcher
                            selectedSurahId={selectedSurahId}
                            onSelect={setSelectedSurahId}
                          />
                        ) : undefined
                      }
                    />
                  </div>
                ))}

                {/* Complete prayer button */}
                <div className="p-6 pb-2 flex justify-center">
                  <button
                    onClick={handleComplete}
                    className="w-full max-w-sm bg-[#1B7A4A] text-white font-bold py-4 rounded-2xl text-[15px] active:scale-[0.97] transition-transform"
                  >
                    Përfundo Namazin
                  </button>
                </div>
              </div>

              {/* Bottom bar */}
              <div
                className="flex items-center justify-center gap-6 frosted-glass safe-bottom flex-shrink-0 relative z-20 py-2"
                style={{ minHeight: '60px', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}
              >
                <button
                  onClick={() => scrollToStepHeader('prev')}
                  className="p-2.5 active:scale-[0.95] transition-transform rounded-full active:bg-[#EFEFF4]"
                >
                  <ChevronLeft size={22} strokeWidth={1.5} className="text-[#6C6C70]" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1B7A4A] text-white active:scale-[0.93] transition-transform"
                >
                  {isPlaying ? (
                    <Pause size={22} strokeWidth={2} fill="currentColor" />
                  ) : (
                    <Play size={22} strokeWidth={2} fill="currentColor" className="ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => scrollToStepHeader('next')}
                  className="p-2.5 active:scale-[0.95] transition-transform rounded-full active:bg-[#EFEFF4]"
                >
                  <ChevronRight size={22} strokeWidth={1.5} className="text-[#6C6C70]" />
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

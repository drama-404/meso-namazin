'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { PrayerStep } from '@/types';

interface UseAudioOptions {
  steps: PrayerStep[];
  onSegmentActivate?: (stepIndex: number, segmentIndex: number) => void;
  onPrayerComplete?: () => void;
}

interface QueueItem {
  stepIndex: number;
  segmentIndex: number;
  audioKey: string;
}

export function useAudio({ steps, onSegmentActivate, onPrayerComplete }: UseAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<QueueItem[]>([]);
  const queueIndexRef = useRef(0);
  const isMountedRef = useRef(true);
  const isPlayingRef = useRef(false);
  const onSegmentActivateRef = useRef(onSegmentActivate);
  const onPrayerCompleteRef = useRef(onPrayerComplete);

  useEffect(() => {
    onSegmentActivateRef.current = onSegmentActivate;
  }, [onSegmentActivate]);

  useEffect(() => {
    onPrayerCompleteRef.current = onPrayerComplete;
  }, [onPrayerComplete]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopAudio();
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, []);

  const buildQueue = useCallback((fromSteps: PrayerStep[]): QueueItem[] => {
    const queue: QueueItem[] = [];
    fromSteps.forEach((step, stepIdx) => {
      const repeatCount = step.repeat && step.repeat > 1 ? step.repeat : 1;
      const repeatFrom = step.repeat_from_segment ?? 0;

      // First pass: play ALL segments (including non-repeated prefix like takbir)
      step.text_segments.forEach((seg, segIdx) => {
        if (seg.audio_key) {
          queue.push({ stepIndex: stepIdx, segmentIndex: segIdx, audioKey: seg.audio_key });
        }
      });

      // Additional repeats: only segments from repeatFrom onward
      for (let r = 1; r < repeatCount; r++) {
        step.text_segments.forEach((seg, segIdx) => {
          if (segIdx >= repeatFrom && seg.audio_key) {
            queue.push({ stepIndex: stepIdx, segmentIndex: segIdx, audioKey: seg.audio_key });
          }
        });
      }
    });
    return queue;
  }, []);

  const playNext = useCallback(() => {
    if (!isMountedRef.current || !isPlayingRef.current) return;

    stopAudio();

    const queue = queueRef.current;
    const idx = queueIndexRef.current;

    if (idx >= queue.length) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setActiveStepIndex(-1);
      setActiveSegmentIndex(-1);
      onPrayerCompleteRef.current?.();
      return;
    }

    const item = queue[idx];
    setActiveStepIndex(item.stepIndex);
    setActiveSegmentIndex(item.segmentIndex);
    onSegmentActivateRef.current?.(item.stepIndex, item.segmentIndex);

    const audio = new Audio(`/audio/${item.audioKey}`);
    audioRef.current = audio;

    audio.onended = () => {
      if (!isMountedRef.current || !isPlayingRef.current) return;
      queueIndexRef.current += 1;
      playNext();
    };

    audio.onerror = () => {
      if (!isMountedRef.current || !isPlayingRef.current) return;
      queueIndexRef.current += 1;
      playNext();
    };

    audio.play().catch(() => {
      if (!isMountedRef.current || !isPlayingRef.current) return;
      queueIndexRef.current += 1;
      playNext();
    });
  }, [stopAudio]);

  const play = useCallback(() => {
    stopAudio();
    queueRef.current = buildQueue(steps);
    queueIndexRef.current = 0;

    if (queueRef.current.length === 0) {
      onPrayerCompleteRef.current?.();
      return;
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    playNext();
  }, [steps, buildQueue, playNext, stopAudio]);

  const pause = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused && audioRef.current.src) {
      isPlayingRef.current = true;
      setIsPlaying(true);
      audioRef.current.play().catch(() => {
        queueIndexRef.current += 1;
        playNext();
      });
    } else if (queueRef.current.length > 0) {
      isPlayingRef.current = true;
      setIsPlaying(true);
      playNext();
    } else {
      play();
    }
  }, [playNext, play]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    stopAudio();
    queueRef.current = [];
    queueIndexRef.current = 0;
    setIsPlaying(false);
    setActiveStepIndex(-1);
    setActiveSegmentIndex(-1);
  }, [stopAudio]);

  const seekToStep = useCallback((stepIndex: number) => {
    const queue = queueRef.current;
    const targetIdx = queue.findIndex(item => item.stepIndex === stepIndex);
    if (targetIdx >= 0) {
      stopAudio();
      queueIndexRef.current = targetIdx;
      if (isPlayingRef.current) {
        playNext();
      }
    }
  }, [playNext, stopAudio]);

  /** Seek to a specific segment within a step and start/continue playing */
  const seekToSegment = useCallback((stepIndex: number, segmentIndex: number) => {
    // Build queue if empty (user tapped before pressing play)
    if (queueRef.current.length === 0) {
      queueRef.current = buildQueue(steps);
    }

    const queue = queueRef.current;
    const targetIdx = queue.findIndex(
      item => item.stepIndex === stepIndex && item.segmentIndex === segmentIndex
    );

    if (targetIdx >= 0) {
      stopAudio();
      queueIndexRef.current = targetIdx;
      isPlayingRef.current = true;
      setIsPlaying(true);
      playNext();
    }
  }, [steps, buildQueue, playNext, stopAudio]);

  return {
    isPlaying,
    activeStepIndex,
    activeSegmentIndex,
    play,
    pause,
    resume,
    stop,
    seekToStep,
    seekToSegment,
  };
}

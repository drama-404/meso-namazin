'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { TextSegment } from '@/types';

interface UseAudioOptions {
  segments: TextSegment[];
  repeat?: number;
  onStepComplete?: () => void;
}

export function useAudio({ segments, repeat = 1, onStepComplete }: UseAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<{ audioKey: string; segmentIndex: number }[]>([]);
  const queueIndexRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const buildQueue = useCallback(() => {
    const queue: { audioKey: string; segmentIndex: number }[] = [];
    for (let r = 0; r < repeat; r++) {
      segments.forEach((seg, i) => {
        if (seg.audio_key) {
          queue.push({ audioKey: seg.audio_key, segmentIndex: i });
        }
      });
    }
    return queue;
  }, [segments, repeat]);

  const playNext = useCallback(() => {
    if (!isMountedRef.current) return;
    const queue = queueRef.current;
    const idx = queueIndexRef.current;

    if (idx >= queue.length) {
      setIsPlaying(false);
      setActiveSegmentIndex(-1);
      onStepComplete?.();
      return;
    }

    const item = queue[idx];
    setActiveSegmentIndex(item.segmentIndex);

    const audio = new Audio(`/audio/${item.audioKey}`);
    audioRef.current = audio;

    audio.onended = () => {
      queueIndexRef.current += 1;
      playNext();
    };

    audio.onerror = () => {
      // Silently skip failed audio
      queueIndexRef.current += 1;
      playNext();
    };

    audio.play().catch(() => {
      // Auto-play blocked — skip
      queueIndexRef.current += 1;
      playNext();
    });
  }, [onStepComplete]);

  const play = useCallback(() => {
    if (isPlaying) return;
    queueRef.current = buildQueue();
    queueIndexRef.current = 0;

    if (queueRef.current.length === 0) {
      // No audio available, auto-advance
      onStepComplete?.();
      return;
    }

    setIsPlaying(true);
    playNext();
  }, [isPlaying, buildQueue, playNext, onStepComplete]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    queueRef.current = [];
    queueIndexRef.current = 0;
    setIsPlaying(false);
    setActiveSegmentIndex(-1);
  }, []);

  return {
    isPlaying,
    activeSegmentIndex,
    play,
    stop,
  };
}

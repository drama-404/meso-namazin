'use client';

import { useState, useEffect } from 'react';

export function useCountdown(targetDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 });
      return;
    }

    function update() {
      const now = Date.now();
      const diff = Math.max(0, targetDate!.getTime() - now);
      const totalSeconds = Math.floor(diff / 1000);
      setTimeLeft({
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        total: totalSeconds,
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate?.getTime()]);

  return timeLeft;
}

export function formatCountdown(hours: number, minutes: number): string {
  if (hours > 0) {
    return `për ${hours} orë e ${minutes} minuta`;
  }
  if (minutes > 0) {
    return `për ${minutes} minuta`;
  }
  return 'tani';
}

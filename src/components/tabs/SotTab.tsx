'use client';

import { useMemo } from 'react';
import { Play, Check, MapPin, Lightbulb } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useCountdown, formatCountdown } from '@/hooks/useCountdown';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PRAYERS, ALBANIAN_MONTHS, DAILY_TIPS } from '@/lib/constants';
import type { PrayerId, DailyProgress } from '@/types';

export default function SotTab() {
  const { state, dispatch } = useApp();
  const { entries, nextPrayer, tomorrowFajr, now } = usePrayerTimes();
  const countdown = useCountdown(nextPrayer?.time ?? null);

  const todayKey = now.toISOString().split('T')[0];
  const [progress] = useLocalStorage<DailyProgress>(
    'meso-namazin-progress',
    { date: todayKey, practiced: [] }
  );

  // Reset progress if it's a new day
  const currentProgress = useMemo(() => {
    if (progress.date !== todayKey) {
      return { date: todayKey, practiced: [] as PrayerId[] };
    }
    return progress;
  }, [progress, todayKey]);

  const dateStr = `${now.getDate()} ${ALBANIAN_MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const dailyTip = DAILY_TIPS[now.getDate() % DAILY_TIPS.length];
  const practicedCount = currentProgress.practiced.length;

  function handleStartPrayer(prayerId: PrayerId) {
    dispatch({ type: 'OPEN_PRAYER_PLAYER', prayerId });
  }

  return (
    <div className="p-4 space-y-4">
      {/* Location & Date */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{state.settings.locationName}</span>
        </div>
        <span>{dateStr}</span>
      </div>

      {/* Next Prayer Hero Card */}
      <div className="rounded-2xl p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #1B7A4A 0%, #2A9D5C 100%)' }}
      >
        {nextPrayer ? (
          <>
            <p className="text-xs uppercase tracking-widest text-white/70 mb-1">
              Namazi i Radhës
            </p>
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-2xl font-bold">{PRAYERS[nextPrayer.id].name_sq}</h2>
              <span className="text-2xl font-bold tabular-nums">
                {entries.find(e => e.id === nextPrayer.id)?.timeFormatted}
              </span>
            </div>
            <p className="text-sm text-white/80 mb-1">
              {PRAYERS[nextPrayer.id].total_rakats} Rekate
            </p>
            <p className="text-sm text-white/70 mb-4">
              {formatCountdown(countdown.hours, countdown.minutes)}
            </p>
            <button
              onClick={() => handleStartPrayer(nextPrayer.id)}
              className="w-full flex items-center justify-center gap-2 bg-white text-primary font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              Fillo Praktikën
            </button>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs uppercase tracking-widest text-white/70 mb-2">
              Namazi i radhës nesër
            </p>
            <h2 className="text-xl font-bold">
              Agimi — {tomorrowFajr?.timeFormatted}
            </h2>
          </div>
        )}
      </div>

      {/* All Prayer Times */}
      <div className="bg-surface rounded-2xl overflow-hidden border border-border">
        {entries.map((entry, i) => {
          const isPracticed = currentProgress.practiced.includes(entry.id);
          return (
            <button
              key={entry.id}
              onClick={() => handleStartPrayer(entry.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-primary-light/50 transition-colors ${
                i < entries.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  entry.isNext ? 'bg-primary' :
                  isPracticed ? 'bg-primary/50' :
                  'bg-text-muted/30'
                }`} />
                <span className={`text-base font-medium ${
                  entry.isPassed && !entry.isNext ? 'text-text-muted' : 'text-foreground'
                }`}>
                  {entry.name_sq}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">
                  {entry.short_label}
                </span>
                <span className={`text-base tabular-nums font-medium ${
                  entry.isPassed && !entry.isNext ? 'text-text-muted' : 'text-foreground'
                }`}>
                  {entry.timeFormatted}
                </span>
                {isPracticed && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Daily Tip */}
      <div className="bg-accent-warm/10 rounded-2xl p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-accent-warm flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/80 leading-relaxed">{dailyTip}</p>
      </div>

      {/* Progress */}
      <div className="bg-surface rounded-2xl p-4 border border-border">
        <p className="text-sm text-text-secondary mb-2">
          Ke praktikuar {practicedCount} nga 5 namazet sot
        </p>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i < practicedCount ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

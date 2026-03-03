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
    <div className="p-4 space-y-5">
      {/* Location & Date */}
      <div className="flex items-center justify-between text-[13px] text-[#6C6C70]">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} strokeWidth={1.5} />
          <span>{state.settings.locationName}</span>
        </div>
        <span>{dateStr}</span>
      </div>

      {/* Next Prayer Hero Card */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B7A4A 0%, #2A9D5C 100%)' }}
      >
        {/* Subtle decorative watermark */}
        <svg
          className="absolute top-3 right-3 opacity-[0.08]"
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="2" />
          <path d="M40 8 C40 8, 56 24, 56 40 C56 56, 40 72, 40 72 C40 72, 24 56, 24 40 C24 24, 40 8, 40 8Z" stroke="white" strokeWidth="1.5" />
          <circle cx="40" cy="18" r="4" fill="white" />
        </svg>

        {nextPrayer ? (
          <>
            <p className="text-xs uppercase tracking-[0.08em] text-white/70 mb-1.5 font-medium">
              Namazi i Radhës
            </p>
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-3xl font-bold tracking-tight">{PRAYERS[nextPrayer.id].name_sq}</h2>
              <span className="text-xl text-white/90 font-semibold tabular-nums">
                {entries.find(e => e.id === nextPrayer.id)?.timeFormatted}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20">
                {PRAYERS[nextPrayer.id].total_rakats} Rekate
              </span>
            </div>
            <p className="text-sm text-white/70 mb-4">
              {formatCountdown(countdown.hours, countdown.minutes)}
            </p>
            <button
              onClick={() => handleStartPrayer(nextPrayer.id)}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#1B7A4A] font-bold py-3 rounded-xl active:scale-[0.97] transition-transform h-12"
            >
              <Play size={16} strokeWidth={2} fill="currentColor" />
              Fillo Praktikën
            </button>
          </>
        ) : (
          <div className="text-center py-3">
            <p className="text-xs uppercase tracking-[0.08em] text-white/70 mb-2 font-medium">
              Namazi i radhës nesër
            </p>
            <h2 className="text-xl font-bold">
              Agimi — {tomorrowFajr?.timeFormatted}
            </h2>
          </div>
        )}
      </div>

      {/* Prayer Times - iOS Grouped List */}
      <div>
        <p className="text-xs font-medium tracking-[0.08em] uppercase text-[#6C6C70] mb-2 px-1">
          Kohët e Namazit
        </p>
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          {entries.map((entry, i) => {
            const isPracticed = currentProgress.practiced.includes(entry.id);
            const isActive = entry.isNext;
            const isPast = entry.isPassed && !entry.isNext;
            return (
              <button
                key={entry.id}
                onClick={() => handleStartPrayer(entry.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-[#F2F2F7] transition-colors ${
                  i < entries.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {isActive ? (
                    <div className="w-2 h-2 rounded-full bg-[#1B7A4A] flex-shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-[15px] ${
                    isActive ? 'font-semibold text-[#1B7A4A]' :
                    isPast ? 'text-[#AEAEB2] font-normal' : 'text-[#1C1C1E] font-normal'
                  }`}>
                    {entry.name_sq}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[13px] font-medium ${
                    isPast ? 'text-[#AEAEB2]' : 'text-[#6C6C70]'
                  }`}>
                    {entry.short_label}
                  </span>
                  <span className={`text-[15px] tabular-nums ${
                    isActive ? 'font-semibold text-[#1B7A4A]' :
                    isPast ? 'text-[#AEAEB2]' : 'text-[#1C1C1E]'
                  }`}>
                    {entry.timeFormatted}
                  </span>
                  {isPracticed && (
                    <Check size={14} strokeWidth={2} className="text-[#34C759]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Tip */}
      <div className="bg-white rounded-2xl card-shadow p-4 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-[#FFF8F0] flex items-center justify-center flex-shrink-0">
          <Lightbulb size={16} strokeWidth={1.5} className="text-[#D4A574]" />
        </div>
        <p className="text-[14px] text-[#3A3A3C] leading-relaxed">{dailyTip}</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl card-shadow p-4">
        <p className="text-[13px] text-[#6C6C70] mb-2.5">
          Ke praktikuar {practicedCount} nga 5 namazet sot
        </p>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i < practicedCount ? 'bg-[#1B7A4A]' : 'bg-[#EFEFF4]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

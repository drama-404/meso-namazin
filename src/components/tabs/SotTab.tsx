'use client';

import { useMemo } from 'react';
import { Play, Check, MapPin, Lightbulb } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PRAYERS, ALBANIAN_MONTHS, DAILY_TIPS } from '@/lib/constants';
import { formatTime } from '@/lib/prayer-times';
import SunArcChart from '@/components/sot/SunArcChart';
import type { PrayerId, DailyProgress } from '@/types';

function formatRemaining(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${minutes}min`;
}

export default function SotTab() {
  const { state, dispatch } = useApp();
  const { entries, tomorrowFajr, now, times, currentWindow } = usePrayerTimes();

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

  // Determine current prayer for active row highlighting
  const currentPrayerId = currentWindow && !currentWindow.isGap ? currentWindow.prayer : null;

  // Tomorrow fajr date for chart
  const tomorrowFajrDate = useMemo(() => {
    if (tomorrowFajr) return tomorrowFajr.time;
    // Calculate it ourselves when tomorrowFajr is null (before isha)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // We need to import getPrayerTimes but it's already used in hook
    // Just pass undefined — chart handles fallback
    return undefined;
  }, [tomorrowFajr, now]);

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

      {/* Hero Banner */}
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        {currentWindow ? (
          <div className="p-4 pb-2">
            {/* Top row: prayer info + button */}
            {currentWindow.isGap ? (
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-[12px] text-[#6C6C70] uppercase tracking-wider">Koha e ardhshme</p>
                  <p className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.02em]">
                    {PRAYERS[currentWindow.gapNextPrayer || 'dhuhr'].name_sq}
                  </p>
                </div>
                <span className="text-[12px] font-medium text-[#6C6C70] bg-[#F2F2F7] px-2.5 py-1 rounded-full">
                  Fillon në {currentWindow.gapNextTime ? formatTime(currentWindow.gapNextTime) : ''}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div>
                    <p className="text-[12px] text-[#6C6C70] uppercase tracking-wider">Namazi aktual</p>
                    <p className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.02em] leading-tight">
                      {PRAYERS[currentWindow.prayer].name_sq}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    currentWindow.isAsr && currentWindow.minutesRemaining <= 30
                      ? 'bg-[#FFF3E0] text-[#FF9500]'
                      : 'bg-[#E8F5EE] text-[#1B7A4A]'
                  }`}>
                    {formatRemaining(currentWindow.minutesRemaining)}
                  </span>
                </div>
                <button
                  onClick={() => handleStartPrayer(currentWindow.prayer)}
                  className="flex items-center gap-1.5 bg-[#1B7A4A] text-white text-[13px] font-semibold px-3.5 py-2 rounded-xl active:scale-[0.97] transition-transform"
                >
                  <Play size={12} strokeWidth={2.5} fill="currentColor" />
                  Fillo
                </button>
              </div>
            )}
            {!currentWindow.isGap && (
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] text-[#6C6C70]">
                  {formatTime(currentWindow.windowStart)} – {formatTime(currentWindow.windowEnd)}
                </p>
                {currentWindow.isAsr && currentWindow.minutesRemaining <= 30 && (
                  <span className="text-[11px] text-[#FF9500] italic">
                    · Mos e shtyj
                  </span>
                )}
              </div>
            )}
            {/* Sun arc chart */}
            <div className="h-[90px] mt-1 -mx-1">
              {times && (
                <SunArcChart
                  prayerTimes={times}
                  now={now}
                  tomorrowFajr={tomorrowFajrDate}
                />
              )}
            </div>
          </div>
        ) : (
          /* After midnight / before fajr — show tomorrow's fajr */
          <div className="flex items-center justify-center gap-2 px-5 py-6">
            <span className="text-[13px] text-[#6C6C70]">Namazi i radhës nesër:</span>
            <span className="text-[16px] font-semibold text-[#1B7A4A]">
              Sabahu — {tomorrowFajr?.timeFormatted}
            </span>
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
            const isCurrent = entry.id === currentPrayerId;
            const isPast = !isCurrent && entry.isPassed;
            return (
              <button
                key={entry.id}
                onClick={() => handleStartPrayer(entry.id)}
                className={`w-full flex items-center justify-between px-4 min-h-[52px] text-left transition-colors ${
                  isCurrent
                    ? 'bg-[#E8F5EE] border-l-2 border-[#1B7A4A] active:bg-[#D9EFDF]'
                    : 'active:bg-[#F2F2F7]'
                } ${i < entries.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[15px] ${
                    isCurrent ? 'font-semibold text-[#1B7A4A]' :
                    isPast ? 'text-[#AEAEB2]' : 'text-[#1C1C1E] font-medium'
                  }`}>
                    {entry.name_sq}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[13px] ${
                    isCurrent ? 'font-medium text-[#1B7A4A]' :
                    isPast ? 'text-[#AEAEB2]' : 'text-[#6C6C70] font-medium'
                  }`}>
                    {entry.short_label}
                  </span>
                  <span className={`text-[15px] tabular-nums ${
                    isCurrent ? 'font-semibold text-[#1B7A4A]' :
                    isPast ? 'text-[#AEAEB2]' : 'text-[#1C1C1E] font-medium'
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

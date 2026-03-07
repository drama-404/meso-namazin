'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Check } from 'lucide-react';
import { Drop, Compass, HandsPraying, Flower, MoonStars, SunHorizon, Moon } from '@phosphor-icons/react';
import { useApp } from '@/contexts/AppContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PRAYERS, ALBANIAN_MONTHS, DAILY_TIPS } from '@/lib/constants';
import { formatTime } from '@/lib/prayer-times';
import { getCurrentHijriDate } from '@/lib/hijri-date';
import SunArcChart from '@/components/sot/SunArcChart';
import type { PrayerId, DailyProgress } from '@/types';

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
  const currentPrayerId = currentWindow && !currentWindow.isGap ? currentWindow.prayer : null;

  const tomorrowFajrDate = useMemo(() => {
    if (tomorrowFajr) return tomorrowFajr.time;
    return undefined;
  }, [tomorrowFajr, now]);

  const hijri = useMemo(() => getCurrentHijriDate(), [todayKey]);
  const isRamadan = hijri.month === 9;

  const fajrEntry = entries.find(e => e.id === 'fajr');
  const maghribEntry = entries.find(e => e.id === 'maghrib');

  function handleStartPrayer(prayerId: PrayerId) {
    dispatch({ type: 'OPEN_PRAYER_PLAYER', prayerId });
  }

  function handleOpenAbdesi() {
    dispatch({ type: 'SET_TAB', tab: 'meso', deepLink: 'wudu' });
  }

  function handleOpenQibla() {
    dispatch({ type: 'TOGGLE_QIBLA' });
  }

  function handleOpenTespihet() {
    dispatch({ type: 'SET_TAB', tab: 'duate', deepLink: 'dhikr' });
  }

  function handleOpenDuate() {
    dispatch({ type: 'SET_TAB', tab: 'duate' });
  }

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2">
      {/* Section 1 — Today Banner */}
      <div className="mx-4">
        {/* Location & Date */}
        <div className="flex items-center justify-between text-[13px] text-[#6C6C70] mb-3">
          <span>{state.settings.locationName}</span>
          <span>{dateStr}</span>
        </div>

        <div className="bg-white rounded-2xl card-shadow px-4 py-4">
          {currentWindow ? (
            <div className="flex items-center gap-4">
              {/* Left column — 30% */}
              <div className="w-[30%] flex-shrink-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6C6C70]">
                  {currentWindow.isGap ? 'Ardhshme' : 'Tani'}
                </p>
                <p className="text-xl font-bold text-[#1C1C1E] mt-0.5">
                  {currentWindow.isGap
                    ? PRAYERS[currentWindow.gapNextPrayer || 'dhuhr'].name_sq
                    : PRAYERS[currentWindow.prayer].name_sq}
                </p>
                <p className="text-xs text-[#6C6C70] mt-0.5">
                  {formatTime(currentWindow.windowStart)} – {formatTime(currentWindow.windowEnd)}
                </p>
              </div>

              {/* Right column — 70% sun arc */}
              <div className="flex-1 h-[80px]">
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
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-[13px] text-[#6C6C70]">Namazi i radhës nesër:</span>
              <span className="text-[16px] font-semibold text-[#1B7A4A]">
                Sabahu — {tomorrowFajr?.timeFormatted}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section 2 — Dock Row */}
      <div className="grid grid-cols-4 px-4">
        {[
          {
            icon: <Drop weight="duotone" size={26} color="#0284C7" />,
            bg: '#E0F2FE',
            border: '#0284C7',
            label: 'Abdesi',
            onTap: handleOpenAbdesi,
          },
          {
            icon: <Compass weight="duotone" size={26} color="#C2760A" />,
            bg: '#FFF4E6',
            border: '#C2760A',
            label: 'Kibla',
            onTap: handleOpenQibla,
          },
          {
            icon: <Flower weight="duotone" size={26} color="#059669" />,
            bg: '#ECFDF5',
            border: '#059669',
            label: 'Tespihet',
            onTap: handleOpenTespihet,
          },
          {
            icon: <HandsPraying weight="duotone" size={26} color="#7C3AED" />,
            bg: '#EDE9FE',
            border: '#7C3AED',
            label: 'Duatë',
            onTap: handleOpenDuate,
          },
        ].map((item) => (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.92 }}
            onClick={item.onTap}
            className="flex flex-col items-center"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center border"
              style={{ background: item.bg, borderColor: `${item.border}30` }}
            >
              {item.icon}
            </div>
            <span className="text-[11px] font-medium text-[#1C1C1E] mt-1.5">{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Section 3 — Prayer Times List */}
      <div className="mx-4">
        <p className="text-xs font-medium tracking-[0.08em] uppercase text-[#6C6C70] mb-2 px-1">
          Kohët e Namazit
        </p>
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          {entries.map((entry, i) => {
            const isPracticed = currentProgress.practiced.includes(entry.id);
            const isCurrent = entry.id === currentPrayerId;
            const isPast = !isCurrent && entry.time < now && !isPracticed;

            return (
              <button
                key={entry.id}
                onClick={() => handleStartPrayer(entry.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  isCurrent
                    ? 'bg-[#E8F5EE] border-l-2 border-[#1B7A4A] active:bg-[#D9EFDF]'
                    : 'active:bg-[#F2F2F7]'
                } ${i < entries.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  {isPracticed && (
                    <Check size={14} strokeWidth={2} className="text-[#34C759]" />
                  )}
                  <span className={`text-[15px] ${
                    isCurrent
                      ? 'font-semibold text-[#1B7A4A]'
                      : isPast
                        ? 'text-[#AEAEB2]'
                        : 'text-[#1C1C1E] font-medium'
                  }`}>
                    {entry.name_sq}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {isCurrent && (
                    <motion.span
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartPrayer(entry.id);
                      }}
                      className="flex items-center gap-1 bg-[#1B7A4A] text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                      <Play size={10} fill="currentColor" strokeWidth={0} />
                      Fillo
                    </motion.span>
                  )}
                  <span className={`text-sm tabular-nums w-10 text-right ${
                    isCurrent
                      ? 'font-semibold text-[#1B7A4A]'
                      : isPast
                        ? 'text-[#AEAEB2]'
                        : 'text-[#1C1C1E] font-medium'
                  }`}>
                    {entry.timeFormatted}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 4 — Bottom Card */}
      <div className="mx-4">
        {isRamadan ? (
          <div className="rounded-2xl px-4 py-3 border border-[#8B7355]/20" style={{ background: '#F5F0E8' }}>
            {/* Top row */}
            <div className="flex items-center gap-1.5">
              <MoonStars size={14} weight="duotone" color="#8B7355" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8B7355]">
                Ramazani · Dita {hijri.day}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-[#8B7355]/15 my-2" />

            {/* Two columns */}
            <div className="flex">
              <div className="flex-1 flex flex-col items-center border-r border-[#8B7355]/15">
                <div className="flex items-center gap-1 mb-0.5">
                  <SunHorizon size={14} weight="duotone" color="#8B7355" />
                  <span className="text-[10px] uppercase tracking-wide text-[#6C6C70]">Syfyri</span>
                </div>
                <span className="text-[10px] text-[#6C6C70]">përfundon</span>
                <span className="text-xl font-bold text-[#1C1C1E]">{fajrEntry?.timeFormatted ?? '--:--'}</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-center gap-1 mb-0.5">
                  <Moon size={14} weight="duotone" color="#8B7355" />
                  <span className="text-[10px] uppercase tracking-wide text-[#6C6C70]">Iftari</span>
                </div>
                <span className="text-[10px] text-[#6C6C70]">fillon</span>
                <span className="text-xl font-bold text-[#1C1C1E]">{maghribEntry?.timeFormatted ?? '--:--'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl card-shadow p-4 flex gap-3">
            <div className="w-1 rounded-full bg-[#1B7A4A] flex-shrink-0" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6C6C70] mb-1.5">
                Këshillë e ditës
              </p>
              <p className="text-sm text-[#1C1C1E] leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

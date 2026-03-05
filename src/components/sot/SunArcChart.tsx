'use client';

import { useMemo } from 'react';
import type { PrayerTimes } from 'adhan';

interface SunArcChartProps {
  prayerTimes: PrayerTimes;
  now: Date;
  tomorrowFajr?: Date;
}

type PointId = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

// --- Chart dimensions ---
const W = 280;
const H = 100;
const PAD_X = 16;
const DRAW_W = W - 2 * PAD_X;

// Arc geometry: sine wave — naturally flattens at both ends
const PEAK_Y = 14;      // top of arc (SVG y, smaller = higher)
const BASELINE_Y = 68;  // bottom of arc (endpoints where sin = 0)
const ICON_OFFSET = 14; // how far below the dot each icon sits

// y from x fraction using sin(x * π): 0 at edges, 1 at center
function arcY(xFraction: number): number {
  const sineValue = Math.sin(xFraction * Math.PI);
  return BASELINE_Y - sineValue * (BASELINE_Y - PEAK_Y);
}

// Convert x fraction to screen x
function screenX(xFraction: number): number {
  return PAD_X + xFraction * DRAW_W;
}

// Generate SVG path by sampling the sine wave at many points
function buildArcPath(startFrac: number, endFrac: number, steps = 80): string {
  const df = (endFrac - startFrac) / steps;
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const f = startFrac + df * i;
    const x = screenX(f);
    const y = arcY(f);
    parts.push(i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return parts.join(' ');
}

// Symmetric x fractions — no midnight
const X_FRACTIONS: Record<PointId, number> = {
  fajr:     0.00,
  sunrise:  0.15,
  dhuhr:    0.50,
  asr:      0.63,
  maghrib:  0.85,
  isha:     1.00,
};

const POINT_ORDER: PointId[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

// Screen positions: x from fraction, y from the sine wave
const SCREEN: Record<PointId, { x: number; y: number }> = {} as Record<PointId, { x: number; y: number }>;
for (const id of POINT_ORDER) {
  const frac = X_FRACTIONS[id];
  SCREEN[id] = { x: screenX(frac), y: arcY(frac) };
}

const FULL_ARC = buildArcPath(0, 1);

// --- Find active prayer ---
function getActivePointId(nowMs: number, times: Date[]): PointId | null {
  for (let i = 0; i < times.length - 1; i++) {
    if (nowMs >= times[i].getTime() && nowMs < times[i + 1].getTime()) return POINT_ORDER[i];
  }
  if (nowMs >= times[times.length - 1].getTime()) return POINT_ORDER[times.length - 1];
  return null;
}

// --- Past/future split ---
function getActiveFraction(nowMs: number, times: Date[]): number | null {
  for (let i = 0; i < times.length - 1; i++) {
    if (nowMs >= times[i].getTime() && nowMs < times[i + 1].getTime()) return X_FRACTIONS[POINT_ORDER[i]];
  }
  if (nowMs >= times[times.length - 1].getTime()) return X_FRACTIONS[POINT_ORDER[times.length - 1]];
  return null;
}

// --- Icon components (sun-colored, 16×16) ---
const SUN = '#E8A838';
const MOON = '#8E99A4';

function FajrIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 8},${y + ICON_OFFSET})`}>
      <path d="M9,4 A5,5 0 1,0 9,12 A3.5,3.5 0 1,1 9,4" fill={MOON} opacity={0.65} />
      <line x1="13" y1="6" x2="15" y2="5" stroke={SUN} strokeWidth="1" opacity={0.5} />
      <line x1="13" y1="10" x2="15" y2="10" stroke={SUN} strokeWidth="1" opacity={0.5} />
    </g>
  );
}

function SunriseIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 8},${y + ICON_OFFSET})`}>
      <line x1="2" y1="11" x2="14" y2="11" stroke={SUN} strokeWidth="0.8" opacity={0.4} />
      <path d="M5,11 A3.5,3.5 0 0,1 11,11" fill={SUN} opacity={0.7} />
      <line x1="8" y1="4" x2="8" y2="2" stroke={SUN} strokeWidth="1" opacity={0.5} />
      <line x1="12" y1="7" x2="14" y2="5" stroke={SUN} strokeWidth="1" opacity={0.5} />
      <line x1="4" y1="7" x2="2" y2="5" stroke={SUN} strokeWidth="1" opacity={0.5} />
    </g>
  );
}

function DhuhrIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 8},${y + ICON_OFFSET})`}>
      <circle cx="8" cy="8" r="3" fill={SUN} opacity={0.8} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line key={a}
            x1={8 + Math.cos(r) * 4.5} y1={8 + Math.sin(r) * 4.5}
            x2={8 + Math.cos(r) * 6.5} y2={8 + Math.sin(r) * 6.5}
            stroke={SUN} strokeWidth="1.2" strokeLinecap="round" opacity={0.6}
          />
        );
      })}
    </g>
  );
}

function AsrIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 8},${y + ICON_OFFSET})`}>
      <circle cx="8" cy="8" r="2.5" fill={SUN} opacity={0.65} />
      {[0, 90, 180, 270].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line key={a}
            x1={8 + Math.cos(r) * 4} y1={8 + Math.sin(r) * 4}
            x2={8 + Math.cos(r) * 5.5} y2={8 + Math.sin(r) * 5.5}
            stroke={SUN} strokeWidth="1" strokeLinecap="round" opacity={0.5}
          />
        );
      })}
    </g>
  );
}

function MaghribIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 8},${y + ICON_OFFSET})`}>
      <line x1="2" y1="11" x2="14" y2="11" stroke={SUN} strokeWidth="0.8" opacity={0.35} />
      <path d="M5,11 A3,3 0 0,1 11,11" fill={SUN} opacity={0.5} />
    </g>
  );
}

function IshaIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 8},${y + ICON_OFFSET})`}>
      <path d="M9,4 A5,5 0 1,0 9,12 A3.5,3.5 0 1,1 9,4" fill={MOON} opacity={0.6} />
    </g>
  );
}

const ICON_MAP: Record<PointId, React.FC<{ x: number; y: number }>> = {
  fajr: FajrIcon, sunrise: SunriseIcon, dhuhr: DhuhrIcon, asr: AsrIcon,
  maghrib: MaghribIcon, isha: IshaIcon,
};

// --- Main component ---
export default function SunArcChart({ prayerTimes, now, tomorrowFajr }: SunArcChartProps) {
  const pointTimes: Date[] = useMemo(() => {
    // 6 points only — no midnight
    return [
      prayerTimes.fajr, prayerTimes.sunrise, prayerTimes.dhuhr,
      prayerTimes.asr, prayerTimes.maghrib, prayerTimes.isha,
    ];
  }, [prayerTimes]);

  const activeId = useMemo(() => getActivePointId(now.getTime(), pointTimes), [now, pointTimes]);
  const splitFrac = useMemo(() => getActiveFraction(now.getTime(), pointTimes), [now, pointTimes]);

  // Past and future arc segments
  const pastPath = useMemo(() => {
    if (splitFrac === null) return '';
    return buildArcPath(0, splitFrac);
  }, [splitFrac]);

  const futurePath = useMemo(() => {
    if (splitFrac === null) return FULL_ARC;
    return buildArcPath(splitFrac, 1);
  }, [splitFrac]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Past segment — full opacity */}
      {pastPath && (
        <path d={pastPath} fill="none" stroke="#1B7A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      )}

      {/* Future segment — dimmed */}
      {futurePath && (
        <path d={futurePath} fill="none" stroke="#1B7A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.18} />
      )}

      {/* Dot markers on the curve — × for sunrise */}
      {POINT_ORDER.map((id) => {
        const p = SCREEN[id];
        const isActive = id === activeId;

        if (id === 'sunrise') {
          return (
            <g key={id} transform={`translate(${p.x},${p.y})`}>
              <line x1="-3" y1="-3" x2="3" y2="3" stroke="#1B7A4A" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
              <line x1="3" y1="-3" x2="-3" y2="3" stroke="#1B7A4A" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
            </g>
          );
        }

        return isActive
          ? <circle key={id} cx={p.x} cy={p.y} r="7" fill="#1B7A4A" />
          : <circle key={id} cx={p.x} cy={p.y} r="4" fill="white" stroke="#1B7A4A" strokeWidth="1.5" opacity={0.7} />;
      })}

      {/* Icons floating below each dot */}
      {POINT_ORDER.map((id) => {
        const p = SCREEN[id];
        const Icon = ICON_MAP[id];
        return <Icon key={id} x={p.x} y={p.y} />;
      })}
    </svg>
  );
}

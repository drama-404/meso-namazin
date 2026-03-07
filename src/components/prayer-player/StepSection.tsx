'use client';

import React from 'react';
import { Repeat2 } from 'lucide-react';
import type { PrayerStep, Gender } from '@/types';
import PostureIllustration from './PostureIllustration';

interface StepSectionProps {
  step: PrayerStep;
  stepIndex: number;
  isFirstInRakat: boolean;
  rakatNumber: number;
  totalRakats: number;
  activeStepIndex: number;
  activeSegmentIndex: number;
  segmentRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  segmentRefOffset: number;
  onSegmentTap?: (stepIndex: number, segmentIndex: number) => void;
  surahSwitcher?: React.ReactNode;
  gender?: Gender;
}

function SalamDualIllustration({ gender = 'male' }: { gender?: Gender }) {
  const folder = gender === 'female' ? 'woman' : 'man';
  const suffix = gender === 'female' ? 'woman' : 'man';
  return (
    <div className="flex items-center justify-center gap-3 w-full">
      <div className="flex-1 flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/illustrations/${folder}/09_salam_right_${suffix}.png`}
          alt="Salam djathtas"
          className="h-36 object-contain"
        />
        <span className="text-[11px] text-[#6C6C70] mt-1">Djathtas</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/illustrations/${folder}/10_salam_left_${suffix}.png`}
          alt="Salam majtas"
          className="h-36 object-contain"
        />
        <span className="text-[11px] text-[#6C6C70] mt-1">Majtas</span>
      </div>
    </div>
  );
}

function StepSectionInner({
  step,
  rakatNumber,
  totalRakats,
  activeStepIndex,
  stepIndex,
  activeSegmentIndex,
  segmentRefs,
  segmentRefOffset,
  onSegmentTap,
  surahSwitcher,
  gender = 'male',
}: StepSectionProps) {
  const repeatFrom = step.repeat_from_segment ?? 0;
  const hasRepeat = step.repeat && step.repeat > 1;
  const isSalam = step.type === 'salam';

  return (
    <div className="relative">
      {/* Sticky step header */}
      <div
        className="sticky z-10 flex items-center justify-between px-4 py-2"
        style={{
          top: 0,
          background: 'var(--step-header-bg)',
          borderLeft: '3px solid var(--step-header-border)',
        }}
      >
        <span className="text-[12px] font-bold tracking-[0.06em] uppercase text-[#1C1C1E]">
          {step.title_sq}
        </span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-[#1C1C1E]">
          Rekati {rakatNumber} nga {totalRakats}
        </span>
      </div>

      {/* Step content on white */}
      <div className="bg-white px-4 py-5">
        {/* Posture Illustration */}
        <div className="mb-3 flex justify-center">
          {isSalam ? <SalamDualIllustration gender={gender} /> : <PostureIllustration type={step.type} gender={gender} />}
        </div>

        {/* Instruction text */}
        {step.instruction_sq && (
          <p className="text-[13px] italic text-[#6C6C70] text-center mb-5 max-w-sm mx-auto">
            {step.instruction_sq}
          </p>
        )}

        {/* Inline surah switcher */}
        {surahSwitcher && (
          <div className="mb-5 flex justify-center">
            {surahSwitcher}
          </div>
        )}

        {/* Text segments */}
        <div>
          {step.text_segments.map((segment, i) => {
            const globalIndex = segmentRefOffset + i;
            const isActive = activeStepIndex === stepIndex && activeSegmentIndex === i;
            // Show repeat badge only on segments that are actually repeated
            const showRepeat = hasRepeat && i >= repeatFrom;

            return (
              <React.Fragment key={i}>
                {/* Hairline divider between segments */}
                {i > 0 && (
                  <div className="mx-4 my-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }} />
                )}
                <div
                  ref={(el) => { segmentRefs.current[globalIndex] = el; }}
                  onClick={() => onSegmentTap?.(stepIndex, i)}
                  className={`py-3 transition-all duration-200 cursor-pointer active:bg-[#F8F8FA] ${
                    isActive ? 'segment-active' : ''
                  }`}
                >
                  {segment.arabic && (
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-[family-name:var(--font-amiri)] text-[18px] leading-[2] text-[#1C1C1E] mb-1.5 text-right"
                    >
                      {segment.arabic}
                    </p>
                  )}
                  <p className="text-[17px] font-semibold text-[#1C1C1E] text-left">
                    {segment.transliteration}
                  </p>
                  <p className="text-[15px] text-[#6C6C70] mt-1 text-left">
                    {segment.translation_sq}
                  </p>
                  {/* Repeat badge — right-aligned, only on repeatable segments */}
                  {showRepeat && (
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <Repeat2 size={14} strokeWidth={2} className="text-[#1B7A4A]" />
                      <span className="text-[14px] text-[#1B7A4A] font-bold">
                        ×{step.repeat}
                      </span>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const StepSection = React.memo(StepSectionInner);
export default StepSection;

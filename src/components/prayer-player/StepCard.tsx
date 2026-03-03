'use client';

import { Repeat2 } from 'lucide-react';
import type { PrayerStep } from '@/types';
import PostureIllustration from './PostureIllustration';

interface StepCardProps {
  step: PrayerStep;
  stepNumber: number;
  totalSteps: number;
  isActive?: boolean;
  activeSegmentIndex?: number;
}

export default function StepCard({ step, stepNumber, totalSteps, activeSegmentIndex }: StepCardProps) {
  return (
    <div className="bg-white rounded-2xl card-shadow overflow-hidden">
      {/* Step Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#6C6C70]">
            Hapi {stepNumber} {step.rakat > 0 ? `· Rekati ${step.rakat}` : ''}
          </p>
          <span className="text-[11px] text-[#AEAEB2] tabular-nums font-medium">
            {stepNumber}/{totalSteps}
          </span>
        </div>
        <h3 className="text-[18px] font-bold text-[#1C1C1E] tracking-[-0.01em]">
          {step.title_sq}
        </h3>
      </div>

      {/* Posture Illustration */}
      <div className="mx-5 mb-3">
        <PostureIllustration type={step.type} />
      </div>

      {/* Instruction Banner */}
      <div className="mx-5 mb-3 p-3.5 bg-[#F2F2F7] rounded-xl">
        <p className="text-[14px] text-[#3A3A3C] leading-relaxed">
          {step.instruction_sq}
        </p>
      </div>

      {/* Repeat indicator */}
      {step.repeat && step.repeat > 1 && (
        <div className="mx-5 mb-3 flex items-center gap-1.5">
          <Repeat2 size={12} strokeWidth={1.5} className="text-[#6C6C70]" />
          <span className="text-[12px] text-[#6C6C70] font-medium">
            Përsërite {step.repeat} herë
          </span>
        </div>
      )}

      {/* Text Segments */}
      <div className="px-5 pb-5 space-y-4">
        {step.text_segments.map((segment, i) => (
          <div
            key={i}
            className={`space-y-1.5 py-2 transition-all duration-200 ${
              activeSegmentIndex === i ? 'segment-active' : ''
            }`}
          >
            {segment.arabic && (
              <p className="arabic-text text-[22px] leading-loose text-[#1C1C1E]">
                {segment.arabic}
              </p>
            )}
            <p className="text-[15px] text-[#3A3A3C] font-medium">
              {segment.transliteration}
            </p>
            <p className="text-[13px] text-[#6C6C70] italic">
              {segment.translation_sq}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

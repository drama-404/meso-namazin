'use client';

import type { PrayerStep } from '@/types';
import Standing from './postures/Standing';
import Bowing from './postures/Bowing';
import Prostrating from './postures/Prostrating';
import Sitting from './postures/Sitting';
import { RefreshCw } from 'lucide-react';

const POSTURE_LABELS: Record<string, string> = {
  standing: 'Kijami — Në Këmbë',
  standing_hands_raised: 'Duart Lart',
  standing_hands_folded: 'Kijami — Duart në Gjoks',
  bowing: 'Rukuja — Përkulja',
  prostrating: 'Sexhdja — Përulësia',
  sitting: 'Ulja',
  salam: 'Selami',
};

function PostureIllustration({ type }: { type: string }) {
  const Component = (() => {
    switch (type) {
      case 'bowing': return Bowing;
      case 'prostrating': return Prostrating;
      case 'sitting':
      case 'salam': return Sitting;
      default: return Standing;
    }
  })();

  return (
    <div className="bg-primary-light/50 rounded-xl p-4 flex flex-col items-center justify-center">
      <Component className="w-20 h-20 text-primary" />
      <p className="text-xs text-primary font-medium mt-2">{POSTURE_LABELS[type] || type}</p>
    </div>
  );
}

interface StepCardProps {
  step: PrayerStep;
  stepNumber: number;
  totalSteps: number;
  isActive?: boolean;
}

export default function StepCard({ step, stepNumber, totalSteps, isActive }: StepCardProps) {
  return (
    <div className={`bg-surface rounded-2xl border transition-colors ${
      isActive ? 'border-primary shadow-sm' : 'border-border'
    }`}>
      {/* Step Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-foreground">
            {step.title_sq}
          </h3>
          <span className="text-xs text-text-muted">
            {stepNumber}/{totalSteps}
          </span>
        </div>
        {step.rakat > 0 && (
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">
            Rekati {step.rakat}
          </span>
        )}
      </div>

      {/* Instruction Banner */}
      <div className="mx-4 mb-3 p-3 bg-surface-alt rounded-xl">
        <p className="text-sm text-foreground/80 leading-relaxed">
          {step.instruction_sq}
        </p>
      </div>

      {/* Posture Illustration */}
      <div className="mx-4 mb-3">
        <PostureIllustration type={step.type} />
      </div>

      {/* Repeat indicator */}
      {step.repeat && step.repeat > 1 && (
        <div className="mx-4 mb-3 flex items-center gap-1.5 text-xs text-primary font-medium">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Përsërite {step.repeat} herë</span>
        </div>
      )}

      {/* Text Segments (Karaoke) */}
      <div className="px-4 pb-4 space-y-4">
        {step.text_segments.map((segment, i) => (
          <div key={i} className="space-y-1">
            {segment.arabic && (
              <p className="arabic-text text-xl leading-loose text-foreground">
                {segment.arabic}
              </p>
            )}
            <p className="text-base text-foreground font-medium">
              {segment.transliteration}
            </p>
            <p className="text-sm text-text-secondary italic">
              {segment.translation_sq}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

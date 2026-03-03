'use client';

import { useState } from 'react';
import { ChevronRight, Lock, ArrowLeft, Droplets, HelpCircle, CheckSquare, ListOrdered, AlertTriangle, Brain, Play } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { LESSONS, LESSON_CONTENT, PREREQUISITES_LIST, WUDU_STEPS, WUDU_BREAKERS } from '@/data/lessons';

const ICON_MAP: Record<string, typeof HelpCircle> = {
  HelpCircle, Droplets, CheckSquare, ListOrdered, AlertTriangle, Brain,
};

type ViewState = { type: 'list' } | { type: 'lesson'; lessonId: string };

export default function MesoTab() {
  const [view, setView] = useState<ViewState>({ type: 'list' });
  const { dispatch } = useApp();

  if (view.type === 'lesson') {
    return (
      <LessonDetail
        lessonId={view.lessonId}
        onBack={() => setView({ type: 'list' })}
        onStartPrayer={(id) => dispatch({ type: 'OPEN_PRAYER_PLAYER', prayerId: id })}
      />
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-bold text-foreground mb-1">Mëso</h2>
      <p className="text-sm text-text-secondary mb-4">
        Rruga jote e të mësuarit, hap pas hapi.
      </p>

      {/* Learning path */}
      <div className="relative">
        {/* Vertical line connecting lessons */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />

        <div className="space-y-3">
          {LESSONS.map((lesson, i) => {
            const Icon = ICON_MAP[lesson.icon] || HelpCircle;
            return (
              <button
                key={lesson.id}
                onClick={() => !lesson.coming_soon && setView({ type: 'lesson', lessonId: lesson.id })}
                disabled={lesson.coming_soon}
                className={`relative w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors ${
                  lesson.coming_soon
                    ? 'border-border bg-surface-alt/50 opacity-70'
                    : 'border-border bg-surface active:bg-primary-light/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  lesson.coming_soon
                    ? 'bg-surface-alt text-text-muted'
                    : 'bg-primary-light text-primary'
                }`}>
                  {lesson.coming_soon ? <Lock className="w-4 h-4" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-semibold ${lesson.coming_soon ? 'text-text-muted' : 'text-foreground'}`}>
                    {lesson.title_sq}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {lesson.description_sq}
                  </p>
                  {lesson.coming_soon && (
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-surface-alt text-text-muted font-medium">
                      Së shpejti
                    </span>
                  )}
                </div>
                {!lesson.coming_soon && (
                  <ChevronRight className="w-5 h-5 text-text-muted flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LessonDetail({
  lessonId,
  onBack,
  onStartPrayer,
}: {
  lessonId: string;
  onBack: () => void;
  onStartPrayer: (id: 'fajr') => void;
}) {
  if (lessonId === 'wudu') return <WuduLesson onBack={onBack} />;

  const content = LESSON_CONTENT[lessonId];
  if (!content) {
    onBack();
    return null;
  }

  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-primary text-sm font-medium mb-4">
        <ArrowLeft className="w-4 h-4" />
        Mbrapa
      </button>

      <h2 className="text-xl font-bold text-foreground mb-4">{content.title_sq}</h2>

      <div className="space-y-4">
        {content.paragraphs.map((p, i) => (
          <p key={i} className="text-base text-foreground/85 leading-relaxed">{p}</p>
        ))}
      </div>

      {/* Prerequisites checklist */}
      {lessonId === 'prerequisites' && (
        <div className="mt-4 space-y-3">
          {PREREQUISITES_LIST.map((item, i) => (
            <div key={i} className="flex gap-3 p-3 bg-surface rounded-xl border border-border">
              <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prayer Steps — CTA to try Fajr */}
      {lessonId === 'prayer-steps' && (
        <button
          onClick={() => onStartPrayer('fajr')}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3.5 rounded-xl active:scale-[0.98] transition-transform"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Provo Namazin e Agimit (2 Rekate)
        </button>
      )}
    </div>
  );
}

function WuduLesson({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-primary text-sm font-medium mb-4">
        <ArrowLeft className="w-4 h-4" />
        Mbrapa
      </button>

      <h2 className="text-xl font-bold text-foreground mb-2">Abdesi — Larja para Namazit</h2>
      <p className="text-sm text-text-secondary mb-6">
        Abdesi është kusht për namazin. Ndiq këto hapa para çdo namazi.
      </p>

      <div className="space-y-4">
        {WUDU_STEPS.map((step) => (
          <div key={step.order} className="bg-surface rounded-2xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.order}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{step.title_sq}</h3>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                  {step.instruction_sq}
                </p>
                {step.dua_arabic && (
                  <div className="mt-3 p-3 bg-primary-light/50 rounded-xl space-y-1">
                    <p className="arabic-text text-base text-foreground">{step.dua_arabic}</p>
                    <p className="text-sm text-foreground font-medium">{step.dua_transliteration}</p>
                    <p className="text-xs text-text-secondary italic">{step.dua_translation_sq}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What breaks Wudu */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-foreground mb-3">Çfarë e prish abdesin?</h3>
        <div className="bg-danger/5 rounded-2xl border border-danger/20 p-4 space-y-2">
          {WUDU_BREAKERS.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-danger text-sm mt-0.5">•</span>
              <p className="text-sm text-foreground/80">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

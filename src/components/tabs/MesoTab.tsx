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
      <h2 className="text-xl font-bold text-[#1C1C1E] mb-1">Mëso</h2>
      <p className="text-[14px] text-[#6C6C70] mb-4">
        Rruga jote e të mësuarit, hap pas hapi.
      </p>

      {/* Learning path */}
      <div className="relative">
        {/* Vertical line connecting lessons */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-[rgba(0,0,0,0.06)]" />

        <div className="space-y-3">
          {LESSONS.map((lesson) => {
            const Icon = ICON_MAP[lesson.icon] || HelpCircle;
            return (
              <button
                key={lesson.id}
                onClick={() => !lesson.coming_soon && setView({ type: 'lesson', lessonId: lesson.id })}
                disabled={lesson.coming_soon}
                className={`relative w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-[0.99] ${
                  lesson.coming_soon
                    ? 'bg-[#EFEFF4]/50 opacity-70'
                    : 'bg-white card-shadow active:bg-[#F2F2F7]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  lesson.coming_soon
                    ? 'bg-[#EFEFF4] text-[#AEAEB2]'
                    : 'bg-[#E8F5EE] text-[#1B7A4A]'
                }`}>
                  {lesson.coming_soon ? <Lock size={16} strokeWidth={1.5} /> : <Icon size={20} strokeWidth={1.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[15px] font-semibold ${lesson.coming_soon ? 'text-[#AEAEB2]' : 'text-[#1C1C1E]'}`}>
                    {lesson.title_sq}
                  </h3>
                  <p className="text-[13px] text-[#6C6C70] line-clamp-2">
                    {lesson.description_sq}
                  </p>
                  {lesson.coming_soon && (
                    <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-[#EFEFF4] text-[#AEAEB2] font-medium">
                      Së shpejti
                    </span>
                  )}
                </div>
                {!lesson.coming_soon && (
                  <ChevronRight size={20} strokeWidth={1.5} className="text-[#AEAEB2] flex-shrink-0" />
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
      <button onClick={onBack} className="flex items-center gap-1 text-[#1B7A4A] text-[14px] font-medium mb-4 active:scale-[0.97] transition-transform">
        <ArrowLeft size={16} strokeWidth={1.5} />
        Mbrapa
      </button>

      <h2 className="text-xl font-bold text-[#1C1C1E] mb-4">{content.title_sq}</h2>

      <div className="space-y-4">
        {content.paragraphs.map((p: string, i: number) => (
          <p key={i} className="text-[15px] text-[#3A3A3C] leading-relaxed">{p}</p>
        ))}
      </div>

      {/* Prerequisites checklist */}
      {lessonId === 'prerequisites' && (
        <div className="mt-4 bg-white rounded-2xl card-shadow overflow-hidden">
          {PREREQUISITES_LIST.map((item: { title: string; description: string }, i: number) => (
            <div key={i} className={`flex gap-3 p-4 ${i < PREREQUISITES_LIST.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-[#1B7A4A] text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div>
                <h4 className="font-semibold text-[#1C1C1E] text-[14px]">{item.title}</h4>
                <p className="text-[13px] text-[#6C6C70]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prayer Steps — CTA to try Fajr */}
      {lessonId === 'prayer-steps' && (
        <button
          onClick={() => onStartPrayer('fajr')}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-[#1B7A4A] text-white font-bold py-3.5 rounded-2xl active:scale-[0.97] transition-transform h-14"
        >
          <Play size={16} strokeWidth={2} fill="currentColor" />
          Provo Namazin e Agimit (2 Rekate)
        </button>
      )}
    </div>
  );
}

function WuduLesson({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-[#1B7A4A] text-[14px] font-medium mb-4 active:scale-[0.97] transition-transform">
        <ArrowLeft size={16} strokeWidth={1.5} />
        Mbrapa
      </button>

      <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">Abdesi — Larja para Namazit</h2>
      <p className="text-[14px] text-[#6C6C70] mb-6">
        Abdesi është kusht për namazin. Ndiq këto hapa para çdo namazi.
      </p>

      <div className="space-y-3">
        {WUDU_STEPS.map((step) => (
          <div key={step.order} className="bg-white rounded-2xl card-shadow p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1B7A4A] text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0">
                {step.order}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1C1C1E]">{step.title_sq}</h3>
                <p className="text-[14px] text-[#6C6C70] mt-1 leading-relaxed">
                  {step.instruction_sq}
                </p>
                {step.dua_arabic && (
                  <div className="mt-3 p-3 bg-[#E8F5EE] rounded-xl space-y-1">
                    <p className="arabic-text text-[16px] text-[#1C1C1E]">{step.dua_arabic}</p>
                    <p className="text-[14px] text-[#1C1C1E] font-medium">{step.dua_transliteration}</p>
                    <p className="text-[12px] text-[#6C6C70] italic">{step.dua_translation_sq}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What breaks Wudu */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-[#1C1C1E] mb-3">Çfarë e prish abdesin?</h3>
        <div className="bg-white rounded-2xl card-shadow p-4 space-y-2" style={{ borderLeft: '3px solid #FF3B30' }}>
          {WUDU_BREAKERS.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#FF3B30] text-[14px] mt-0.5">&#8226;</span>
              <p className="text-[14px] text-[#3A3A3C]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { BookOpen, Heart, Search, Lock, ArrowLeft, ChevronRight, Moon } from 'lucide-react';
import { SURAHS, FATIHA_SURAH } from '@/data/surahs';
import { AFTER_PRAYER_DHIKR } from '@/data/dhikr';
import { GLOSSARY } from '@/data/glossary';
import DhikrCounter from '@/components/ui/DhikrCounter';
import type { Surah, GlossaryEntry } from '@/types';

type ViewState =
  | { type: 'main' }
  | { type: 'surahs' }
  | { type: 'surah'; surah: Surah }
  | { type: 'dhikr' }
  | { type: 'glossary' };

export default function DuateTab() {
  const [view, setView] = useState<ViewState>({ type: 'main' });

  if (view.type === 'surah') return <SurahDetail surah={view.surah} onBack={() => setView({ type: 'surahs' })} />;
  if (view.type === 'surahs') return <SurahsList onBack={() => setView({ type: 'main' })} onSelect={(s) => setView({ type: 'surah', surah: s })} />;
  if (view.type === 'dhikr') return <DhikrSection onBack={() => setView({ type: 'main' })} />;
  if (view.type === 'glossary') return <GlossarySection onBack={() => setView({ type: 'main' })} />;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-bold text-foreground mb-1">Duatë & Referenca</h2>
      <p className="text-sm text-text-secondary mb-4">
        Suret, dhikri pas namazit, dhe fjalori islam.
      </p>

      {/* Section Cards */}
      <SectionCard
        icon={<BookOpen className="w-5 h-5" />}
        title="Suret e Shkurtra"
        description="Fatiha, Ihlas, Keuther, Kafirun, Nas, Felek"
        onClick={() => setView({ type: 'surahs' })}
      />
      <SectionCard
        icon={<Heart className="w-5 h-5" />}
        title="Dhikri pas Namazit"
        description="SubhanAllah, Elhamdulillah, Allahu Ekber"
        onClick={() => setView({ type: 'dhikr' })}
      />
      <SectionCard
        icon={<Search className="w-5 h-5" />}
        title="Fjalorth"
        description="Terma islame me shpjegim në shqip"
        onClick={() => setView({ type: 'glossary' })}
      />

      {/* Coming soon sections */}
      <div className="border border-border rounded-2xl p-4 opacity-70 bg-surface-alt/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-text-muted">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-text-muted">Duatë të Përditshme</h3>
            <p className="text-sm text-text-muted">Para gjumit, kur zgjohesh, para bukës...</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-surface-alt text-text-muted font-medium">
              Së shpejti
            </span>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-2xl p-4 opacity-70 bg-surface-alt/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-text-muted">
            <Moon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-text-muted">Ramazani</h3>
            <p className="text-sm text-text-muted">Teravitë, duatë e iftarit, Nata e Kadrit...</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-surface-alt text-text-muted font-medium">
              Së shpejti — para Ramazanit!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, description, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface text-left active:bg-primary-light/30 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-text-secondary line-clamp-1">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-text-muted flex-shrink-0" />
    </button>
  );
}

function SurahsList({ onBack, onSelect }: { onBack: () => void; onSelect: (s: Surah) => void }) {
  const allSurahs = [FATIHA_SURAH, ...SURAHS];
  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-primary text-sm font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Mbrapa
      </button>
      <h2 className="text-xl font-bold text-foreground mb-4">Suret e Shkurtra</h2>
      <div className="space-y-2">
        {allSurahs.map((surah) => (
          <button
            key={surah.id}
            onClick={() => onSelect(surah)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-surface text-left active:bg-primary-light/30"
          >
            <div>
              <h3 className="font-semibold text-foreground">{surah.title_sq}</h3>
              <p className="text-xs text-text-muted">
                {surah.text_segments.length} ajete
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SurahDetail({ surah, onBack }: { surah: Surah; onBack: () => void }) {
  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-primary text-sm font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Mbrapa
      </button>
      <h2 className="text-xl font-bold text-foreground mb-6">{surah.title_sq}</h2>
      <div className="space-y-5">
        {surah.text_segments.map((seg, i) => (
          <div key={i} className="space-y-1.5 pb-4 border-b border-border last:border-0">
            {seg.arabic && (
              <p className="arabic-text text-2xl leading-loose text-foreground">{seg.arabic}</p>
            )}
            <p className="text-base font-medium text-foreground">{seg.transliteration}</p>
            <p className="text-sm text-text-secondary italic">{seg.translation_sq}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DhikrSection({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-primary text-sm font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Mbrapa
      </button>
      <h2 className="text-xl font-bold text-foreground mb-2">Dhikri pas Namazit</h2>
      <p className="text-sm text-text-secondary mb-6">
        Pas selamit, thuaj këto dhikre. Prek butonin për të numëruar.
      </p>
      <div className="space-y-4">
        {AFTER_PRAYER_DHIKR.map((item) => (
          <DhikrCounter key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function GlossarySection({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? GLOSSARY.filter(
        (entry) =>
          entry.term.toLowerCase().includes(search.toLowerCase()) ||
          entry.definition_sq.toLowerCase().includes(search.toLowerCase())
      )
    : GLOSSARY;

  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-primary text-sm font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Mbrapa
      </button>
      <h2 className="text-xl font-bold text-foreground mb-4">Fjalorth</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Kërko..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((entry, i) => (
          <div key={i} className="p-3 rounded-xl border border-border bg-surface">
            <h4 className="font-semibold text-foreground text-sm">{entry.term}</h4>
            <p className="text-sm text-text-secondary mt-0.5">{entry.definition_sq}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">Asnjë rezultat.</p>
        )}
      </div>
    </div>
  );
}

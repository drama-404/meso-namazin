'use client';

import { useApp } from '@/contexts/AppContext';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import SotTab from '@/components/tabs/SotTab';
import MesoTab from '@/components/tabs/MesoTab';
import DuateTab from '@/components/tabs/DuateTab';
import PrayerPlayer from '@/components/prayer-player/PrayerPlayer';
import QiblaCompass from '@/components/qibla/QiblaCompass';
import SettingsPanel from '@/components/settings/SettingsPanel';
import Onboarding from '@/components/onboarding/Onboarding';

export default function Home() {
  const { state } = useApp();

  return (
    <div className="min-h-dvh bg-background">
      <Header />

      <main className="pt-14 pb-16 scrollbar-hide">
        {state.activeTab === 'sot' && <SotTab />}
        {state.activeTab === 'meso' && <MesoTab />}
        {state.activeTab === 'duate' && <DuateTab />}
      </main>

      <BottomNav />

      {/* Fullscreen Overlays */}
      <PrayerPlayer />
      <QiblaCompass />
      <SettingsPanel />
      <Onboarding />
    </div>
  );
}

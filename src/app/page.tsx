'use client';

import { motion, AnimatePresence } from 'framer-motion';
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

  const tabContent: Record<string, React.ReactNode> = {
    sot: <SotTab />,
    meso: <MesoTab />,
    duate: <DuateTab />,
  };

  return (
    <div className="min-h-dvh bg-[#F2F2F7]">
      <Header />

      <main className="pt-12 pb-14 scrollbar-hide max-w-[480px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {tabContent[state.activeTab]}
          </motion.div>
        </AnimatePresence>
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

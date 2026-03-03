'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Play, Settings, CheckCircle2, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { ONBOARDING_CARDS } from '@/data/onboarding';
import type { Gender } from '@/types';

const ICON_MAP: Record<string, typeof BookOpen> = {
  BookOpen,
  Heart,
  Play,
  Settings,
  CheckCircle2,
};

export default function Onboarding() {
  const { state, dispatch } = useApp();
  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState(0);

  if (state.settings.hasCompletedOnboarding) return null;

  const card = ONBOARDING_CARDS[currentCard];
  const isLast = currentCard === ONBOARDING_CARDS.length - 1;
  const isSetupCard = card.hasSetup;
  const Icon = ICON_MAP[card.icon] || BookOpen;

  function goNext() {
    if (isLast) {
      dispatch({ type: 'COMPLETE_ONBOARDING' });
    } else {
      setDirection(1);
      setCurrentCard(prev => prev + 1);
    }
  }

  function goPrev() {
    if (currentCard > 0) {
      setDirection(-1);
      setCurrentCard(prev => prev - 1);
    }
  }

  function handleGender(g: Gender) {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { gender: g } });
  }

  function handleLocation() {
    if (!navigator.geolocation) {
      goNext();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        dispatch({
          type: 'UPDATE_SETTINGS',
          settings: {
            locationLat: pos.coords.latitude,
            locationLng: pos.coords.longitude,
          },
        });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=sq`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village;
          if (city) {
            dispatch({ type: 'UPDATE_SETTINGS', settings: { locationName: city } });
          }
        } catch {
          // Keep default
        }
      },
      () => {
        // Permission denied — use default Tirana
      }
    );
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -500) {
      goNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 500) {
      goPrev();
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#F2F2F7] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={card.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center w-full"
          >
            <div className="w-20 h-20 rounded-full bg-[#E8F5EE] flex items-center justify-center mb-6">
              <Icon size={36} strokeWidth={1.5} className="text-[#1B7A4A]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1C1C1E] mb-3">{card.title_sq}</h2>
            <p className="text-[16px] text-[#6C6C70] leading-relaxed max-w-sm mb-8">
              {card.description_sq}
            </p>

            {/* Setup section */}
            {isSetupCard && (
              <div className="w-full max-w-sm space-y-4 mb-8">
                {/* Gender selection */}
                <div>
                  <p className="text-[13px] font-medium text-[#1C1C1E] mb-2">Gjinia</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGender('male')}
                      className={`flex-1 py-3 rounded-xl text-[14px] font-medium transition-all active:scale-[0.97] ${
                        state.settings.gender === 'male'
                          ? 'bg-[#1B7A4A] text-white'
                          : 'bg-[#EFEFF4] text-[#6C6C70]'
                      }`}
                    >
                      Mashkull
                    </button>
                    <button
                      onClick={() => handleGender('female')}
                      className={`flex-1 py-3 rounded-xl text-[14px] font-medium transition-all active:scale-[0.97] ${
                        state.settings.gender === 'female'
                          ? 'bg-[#1B7A4A] text-white'
                          : 'bg-[#EFEFF4] text-[#6C6C70]'
                      }`}
                    >
                      Femër
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-[13px] font-medium text-[#1C1C1E] mb-2">Vendndodhja</p>
                  <button
                    onClick={handleLocation}
                    className="w-full py-3 rounded-xl text-[14px] font-medium bg-[#E8F5EE] text-[#1B7A4A] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                  >
                    <MapPin size={16} strokeWidth={1.5} />
                    Lejo Vendndodhjen
                  </button>
                  <p className="text-[12px] text-[#AEAEB2] mt-1.5">
                    Aktualisht: {state.settings.locationName}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-8 safe-bottom">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {ONBOARDING_CARDS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentCard ? 'w-6 bg-[#1B7A4A]' : 'w-2 bg-[#EFEFF4]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-full bg-[#1B7A4A] text-white font-bold py-3.5 rounded-2xl active:scale-[0.97] transition-transform h-14"
        >
          {isLast ? 'Fillo!' : 'Vazhdo'}
        </button>

        {currentCard > 0 && !isLast && (
          <button
            onClick={goPrev}
            className="w-full text-[#AEAEB2] text-[14px] font-medium py-2 mt-2 active:scale-[0.97] transition-transform"
          >
            Mbrapa
          </button>
        )}
      </div>
    </div>
  );
}

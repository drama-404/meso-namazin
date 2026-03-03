'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, User, RotateCcw, Info } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { Gender } from '@/types';

export default function SettingsPanel() {
  const { state, dispatch } = useApp();

  if (!state.overlays.settings) return null;

  const { gender, locationName } = state.settings;

  function handleGenderChange(g: Gender) {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { gender: g } });
  }

  function handleRequestLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        dispatch({
          type: 'UPDATE_SETTINGS',
          settings: {
            locationLat: latitude,
            locationLng: longitude,
          },
        });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=sq`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county;
          if (city) {
            dispatch({ type: 'UPDATE_SETTINGS', settings: { locationName: city } });
          }
        } catch {
          // Keep default location name
        }
      },
      () => {
        // Permission denied or error — keep defaults
      }
    );
  }

  function handleRestartOnboarding() {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { hasCompletedOnboarding: false } });
    dispatch({ type: 'CLOSE_SETTINGS' });
    window.location.reload();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-50 bg-[#F2F2F7] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 frosted-glass safe-top" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
          <button
            onClick={() => dispatch({ type: 'CLOSE_SETTINGS' })}
            className="p-2 -ml-2 active:scale-[0.97] transition-transform"
          >
            <X size={20} strokeWidth={1.5} className="text-[#6C6C70]" />
          </button>
          <h2 className="text-[15px] font-semibold text-[#1C1C1E]">Cilësimet</h2>
          <div className="w-9" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-[480px] mx-auto w-full">
          {/* Gender */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User size={16} strokeWidth={1.5} className="text-[#6C6C70]" />
              <h3 className="font-semibold text-[#1C1C1E]">Gjinia</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenderChange('male')}
                className={`flex-1 py-3 rounded-xl text-[14px] font-medium transition-all active:scale-[0.97] ${
                  gender === 'male'
                    ? 'bg-[#1B7A4A] text-white'
                    : 'bg-[#EFEFF4] text-[#6C6C70]'
                }`}
              >
                Mashkull
              </button>
              <button
                onClick={() => handleGenderChange('female')}
                className={`flex-1 py-3 rounded-xl text-[14px] font-medium transition-all active:scale-[0.97] ${
                  gender === 'female'
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
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} strokeWidth={1.5} className="text-[#6C6C70]" />
              <h3 className="font-semibold text-[#1C1C1E]">Vendndodhja</h3>
            </div>
            <div className="bg-white rounded-xl card-shadow p-3.5 flex items-center justify-between">
              <span className="text-[14px] text-[#1C1C1E]">{locationName}</span>
              <button
                onClick={handleRequestLocation}
                className="text-[13px] text-[#1B7A4A] font-medium px-3 py-1.5 rounded-lg bg-[#E8F5EE] active:scale-[0.97] transition-transform"
              >
                Përditëso
              </button>
            </div>
          </div>

          {/* Restart Onboarding */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw size={16} strokeWidth={1.5} className="text-[#6C6C70]" />
              <h3 className="font-semibold text-[#1C1C1E]">Rishiko Udhëzimin</h3>
            </div>
            <button
              onClick={handleRestartOnboarding}
              className="w-full py-3 rounded-xl text-[14px] font-medium bg-[#EFEFF4] text-[#6C6C70] active:scale-[0.97] transition-transform"
            >
              Fillo nga Zero
            </button>
          </div>

          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} strokeWidth={1.5} className="text-[#6C6C70]" />
              <h3 className="font-semibold text-[#1C1C1E]">Rreth Aplikacionit</h3>
            </div>
            <div className="bg-white rounded-xl card-shadow p-4">
              <p className="text-[14px] text-[#1C1C1E] font-medium mb-1">Mëso Namazin v1.0</p>
              <p className="text-[14px] text-[#6C6C70] leading-relaxed">
                Aplikacion falas për të mësuar namazin hap pas hapi. Ndërtuar me dashuri për komunitetin shqiptar.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

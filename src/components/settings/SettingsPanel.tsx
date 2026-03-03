'use client';

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
        // Try reverse geocoding
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
    // Force reload to show onboarding
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-surface safe-top">
        <button
          onClick={() => dispatch({ type: 'CLOSE_SETTINGS' })}
          className="p-2 -ml-2 text-text-secondary"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-base font-semibold text-foreground">Cilësimet</h2>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Gender */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-text-secondary" />
            <h3 className="font-semibold text-foreground">Gjinia</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleGenderChange('male')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                gender === 'male'
                  ? 'bg-primary text-white'
                  : 'bg-surface-alt text-text-secondary border border-border'
              }`}
            >
              Mashkull
            </button>
            <button
              onClick={() => handleGenderChange('female')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                gender === 'female'
                  ? 'bg-primary text-white'
                  : 'bg-surface-alt text-text-secondary border border-border'
              }`}
            >
            Femër
            </button>
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-text-secondary" />
            <h3 className="font-semibold text-foreground">Vendndodhja</h3>
          </div>
          <div className="bg-surface-alt rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm text-foreground">{locationName}</span>
            <button
              onClick={handleRequestLocation}
              className="text-xs text-primary font-medium px-3 py-1.5 rounded-lg bg-primary-light"
            >
              Përditëso
            </button>
          </div>
        </div>

        {/* Restart Onboarding */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RotateCcw className="w-4 h-4 text-text-secondary" />
            <h3 className="font-semibold text-foreground">Rishiko Udhëzimin</h3>
          </div>
          <button
            onClick={handleRestartOnboarding}
            className="w-full py-3 rounded-xl text-sm font-medium bg-surface-alt text-text-secondary border border-border active:bg-border transition-colors"
          >
            Fillo nga Zero
          </button>
        </div>

        {/* About */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-text-secondary" />
            <h3 className="font-semibold text-foreground">Rreth Aplikacionit</h3>
          </div>
          <div className="bg-surface-alt rounded-xl p-4">
            <p className="text-sm text-foreground font-medium mb-1">Mëso Namazin v1.0</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Aplikacion falas për të mësuar namazin hap pas hapi. Ndërtuar me dashuri për komunitetin shqiptar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ONBOARDING_CARDS } from '@/data/onboarding';
import type { Gender } from '@/types';

export default function Onboarding() {
  const { state, dispatch } = useApp();
  const [currentCard, setCurrentCard] = useState(0);

  if (state.settings.hasCompletedOnboarding) return null;

  const card = ONBOARDING_CARDS[currentCard];
  const isLast = currentCard === ONBOARDING_CARDS.length - 1;
  const isSetupCard = card.hasSetup;

  function goNext() {
    if (isLast) {
      dispatch({ type: 'COMPLETE_ONBOARDING' });
    } else {
      setCurrentCard(prev => prev + 1);
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

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="text-6xl mb-6">{card.emoji}</div>
        <h2 className="text-2xl font-bold text-foreground mb-3">{card.title_sq}</h2>
        <p className="text-base text-text-secondary leading-relaxed max-w-sm mb-8">
          {card.description_sq}
        </p>

        {/* Setup section */}
        {isSetupCard && (
          <div className="w-full max-w-sm space-y-4 mb-8">
            {/* Gender selection */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Gjinia</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGender('male')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    state.settings.gender === 'male'
                      ? 'bg-primary text-white'
                      : 'bg-surface-alt text-text-secondary border border-border'
                  }`}
                >
                  Mashkull
                </button>
                <button
                  onClick={() => handleGender('female')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    state.settings.gender === 'female'
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
              <p className="text-sm font-medium text-foreground mb-2">Vendndodhja</p>
              <button
                onClick={handleLocation}
                className="w-full py-3 rounded-xl text-sm font-medium bg-primary-light text-primary border border-primary/20"
              >
                📍 Lejo Vendndodhjen
              </button>
              <p className="text-xs text-text-muted mt-1">
                Aktualisht: {state.settings.locationName}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-8 safe-bottom">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {ONBOARDING_CARDS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentCard ? 'w-6 bg-primary' : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl active:scale-[0.98] transition-transform"
        >
          {isLast ? 'Fillo!' : 'Vazhdo'}
        </button>

        {currentCard > 0 && !isLast && (
          <button
            onClick={() => setCurrentCard(prev => prev - 1)}
            className="w-full text-text-muted text-sm font-medium py-2 mt-2"
          >
            Mbrapa
          </button>
        )}
      </div>
    </div>
  );
}

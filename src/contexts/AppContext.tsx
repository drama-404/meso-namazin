'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction, AppSettings } from '@/types';
import { DEFAULT_LAT, DEFAULT_LNG, DEFAULT_LOCATION_NAME } from '@/lib/constants';

const defaultSettings: AppSettings = {
  gender: 'male',
  locationLat: DEFAULT_LAT,
  locationLng: DEFAULT_LNG,
  locationName: DEFAULT_LOCATION_NAME,
  hasCompletedOnboarding: false,
};

const initialState: AppState = {
  activeTab: 'sot',
  settings: defaultSettings,
  overlays: {
    prayerPlayer: { open: false },
    qibla: false,
    settings: false,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'OPEN_PRAYER_PLAYER':
      return {
        ...state,
        overlays: { ...state.overlays, prayerPlayer: { open: true, prayerId: action.prayerId } },
      };
    case 'CLOSE_PRAYER_PLAYER':
      return {
        ...state,
        overlays: { ...state.overlays, prayerPlayer: { open: false } },
      };
    case 'TOGGLE_QIBLA':
      return {
        ...state,
        overlays: { ...state.overlays, qibla: !state.overlays.qibla },
      };
    case 'OPEN_SETTINGS':
      return {
        ...state,
        overlays: { ...state.overlays, settings: true },
      };
    case 'CLOSE_SETTINGS':
      return {
        ...state,
        overlays: { ...state.overlays, settings: false },
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        settings: { ...state.settings, hasCompletedOnboarding: true },
      };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Hydrate settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('meso-namazin-settings');
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppSettings>;
        dispatch({ type: 'UPDATE_SETTINGS', settings: parsed });
      }
    } catch {
      // Use defaults
    }
  }, []);

  // Persist settings to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('meso-namazin-settings', JSON.stringify(state.settings));
    } catch {
      // Silently fail
    }
  }, [state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

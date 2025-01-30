import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isChristmas } from '../lib/utils/time-utils';

interface SpecialThemeStore {
  isEnabled: boolean | null;
  setIsEnabled: (value: boolean) => void;
}

const useSpecialThemeStore = create(
  persist<SpecialThemeStore>(
    (set) => ({
      isEnabled: null,
      setIsEnabled: (value: boolean) => {
        if (value && !isChristmas()) {
          return;
        }
        set({ isEnabled: value });
      },
    }),
    {
      name: 'Special-theme-storage',
      onRehydrateStorage: () => {
        return (state) => {
          if (state && !isChristmas()) {
            state.isEnabled = null;
          }
        };
      },
    },
  ),
);

export default useSpecialThemeStore;

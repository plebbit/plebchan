import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SpecialThemeStore {
  isEnabled: boolean | null;
  setIsEnabled: (value: boolean) => void;
}

const isChristmas = () => {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  return (month === 11 && day >= 24) || (month === 0 && day <= 5);
};

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

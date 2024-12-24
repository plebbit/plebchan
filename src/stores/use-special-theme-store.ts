import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SpecialThemeStore {
  isEnabled: boolean | null;
  setIsEnabled: (value: boolean) => void;
}

const useSpecialThemeStore = create(
  persist<SpecialThemeStore>(
    (set) => ({
      isEnabled: null,
      setIsEnabled: (value: boolean) => set({ isEnabled: value }),
    }),
    {
      name: 'Special-theme-storage',
    },
  ),
);

export default useSpecialThemeStore;

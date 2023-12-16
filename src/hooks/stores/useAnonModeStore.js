import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAnonModeStore = create(
  persist(
    (set) => ({
      anonymousMode: true,
      setAnonymousMode: (mode) => set({ anonymousMode: mode }),
    }),
    {
      name: 'anonmode_store',
      getStorage: () => localStorage,
    },
  ),
);

export default useAnonModeStore;

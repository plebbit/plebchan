import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SubplebbitStatsVisibilityState {
  hiddenStats: { [subplebbitAddress: string]: boolean };
  toggleVisibility: (subplebbitAddress: string) => void;
}

const useSubplebbitStatsVisibilityStore = create<SubplebbitStatsVisibilityState>()(
  persist(
    (set) => ({
      hiddenStats: {},
      toggleVisibility: (subplebbitAddress) =>
        set((state) => ({
          hiddenStats: {
            ...state.hiddenStats,
            [subplebbitAddress]: !state.hiddenStats[subplebbitAddress],
          },
        })),
    }),
    {
      name: 'subplebbit-stats-visibility',
    },
  ),
);

export default useSubplebbitStatsVisibilityStore;

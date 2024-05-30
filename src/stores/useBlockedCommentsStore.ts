import { create } from 'zustand';

interface StoreState {
  showBlockedComments: boolean;
  setShowBlockedComments: (show: boolean) => void;
  resetShowBlockedComments: () => void;
}

const useStore = create<StoreState>((set) => ({
  showBlockedComments: false,
  setShowBlockedComments: (show) => set({ showBlockedComments: show }),
  resetShowBlockedComments: () => set({ showBlockedComments: false }),
}));

export default useStore;

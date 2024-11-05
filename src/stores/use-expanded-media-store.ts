import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExpandedMediaState {
  fitExpandedImagesToScreen: boolean;
  setFitExpandedImagesToScreen: (fit: boolean) => void;
}

const useExpandedMediaStore = create<ExpandedMediaState>()(
  persist(
    (set) => ({
      fitExpandedImagesToScreen: false,
      setFitExpandedImagesToScreen: (fit) => set({ fitExpandedImagesToScreen: fit }),
    }),
    {
      name: 'expanded-media-store',
    },
  ),
);

export default useExpandedMediaStore;

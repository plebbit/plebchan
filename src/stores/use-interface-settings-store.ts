import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InterfaceSettingsStore {
  hideGoreBoards: boolean;
  setHideGoreBoards: (value: boolean) => void;
  hideAdultBoards: boolean;
  setHideAdultBoards: (value: boolean) => void;
  hideThreadsWithoutImages: boolean;
  setHideThreadsWithoutImages: (value: boolean) => void;
}

const useInterfaceSettingsStore = create(
  persist<InterfaceSettingsStore>(
    (set) => ({
      hideGoreBoards: true,
      setHideGoreBoards: (value: boolean) => set({ hideGoreBoards: value }),
      hideAdultBoards: true,
      setHideAdultBoards: (value: boolean) => set({ hideAdultBoards: value }),
      hideThreadsWithoutImages: true,
      setHideThreadsWithoutImages: (value: boolean) => set({ hideThreadsWithoutImages: value }),
    }),
    {
      name: 'interface-settings-storage',
    },
  ),
);

export default useInterfaceSettingsStore;

import { create } from 'zustand';

interface CatalogFiltersStore {
  showAdultBoards: boolean;
  setShowAdultBoards: (value: boolean) => void;
  showGoreBoards: boolean;
  setShowGoreBoards: (value: boolean) => void;
  showTextOnlyThreads: boolean;
  setShowTextOnlyThreads: (value: boolean) => void;
}

const useCatalogFiltersStore = create<CatalogFiltersStore>((set) => ({
  showTextOnlyThreads: localStorage.getItem('showTextOnlyThreads') === 'true' ? true : false,
  setShowTextOnlyThreads: (value: boolean) => {
    set({ showTextOnlyThreads: value });
    localStorage.setItem('showTextOnlyThreads', value.toString());
  },
  showAdultBoards: localStorage.getItem('showAdultBoards') === 'true' ? true : false,
  setShowAdultBoards: (value: boolean) => {
    set({ showAdultBoards: value });
    localStorage.setItem('showAdultBoards', value.toString());
  },
  showGoreBoards: localStorage.getItem('showGoreBoards') === 'true' ? true : false,
  setShowGoreBoards: (value: boolean) => {
    set({ showGoreBoards: value });
    localStorage.setItem('showGoreBoards', value.toString());
  },
}));

export default useCatalogFiltersStore;

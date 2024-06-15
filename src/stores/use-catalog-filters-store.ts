import { create } from 'zustand';

interface CatalogFiltersStore {
  showTextOnlyThreads: boolean;
  setShowTextOnlyThreads: (value: boolean) => void;
}

const useCatalogFiltersStore = create<CatalogFiltersStore>((set) => ({
  showTextOnlyThreads: localStorage.getItem('showTextOnlyThreads') === 'true' ? true : false,
  setShowTextOnlyThreads: (value: boolean) => {
    set({ showTextOnlyThreads: value });
    localStorage.setItem('showTextOnlyThreads', value.toString());
  },
}));

export default useCatalogFiltersStore;

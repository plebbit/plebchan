import { create } from 'zustand';

interface CatalogFiltersStore {
  showTextOnlyThreads: boolean;
  setShowTextOnlyThreads: (value: boolean) => void;
  sortType: 'active' | 'new';
  setSortType: (type: 'active' | 'new') => void;
}

const useCatalogFiltersStore = create<CatalogFiltersStore>((set) => ({
  showTextOnlyThreads: localStorage.getItem('showTextOnlyThreads') === 'true' ? true : false,
  setShowTextOnlyThreads: (value: boolean) => {
    set({ showTextOnlyThreads: value });
    localStorage.setItem('showTextOnlyThreads', value.toString());
  },

  sortType: 'active',
  setSortType: (type: 'active' | 'new') => set({ sortType: type }),
}));

export default useCatalogFiltersStore;

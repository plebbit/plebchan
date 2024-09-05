import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CatalogFiltersStore {
  showAdultBoards: boolean;
  setShowAdultBoards: (value: boolean) => void;
  showGoreBoards: boolean;
  setShowGoreBoards: (value: boolean) => void;
  showTextOnlyThreads: boolean;
  setShowTextOnlyThreads: (value: boolean) => void;
  filterText: string;
  setFilterText: (value: string) => void;
}

const useCatalogFiltersStore = create(
  persist<CatalogFiltersStore>(
    (set) => ({
      showTextOnlyThreads: false,
      setShowTextOnlyThreads: (value: boolean) => set({ showTextOnlyThreads: value }),
      showAdultBoards: false,
      setShowAdultBoards: (value: boolean) => set({ showAdultBoards: value }),
      showGoreBoards: false,
      setShowGoreBoards: (value: boolean) => set({ showGoreBoards: value }),
      filterText: '',
      setFilterText: (value: string) => set({ filterText: value }),
    }),
    {
      name: 'catalog-filters-storage',
    },
  ),
);

export default useCatalogFiltersStore;

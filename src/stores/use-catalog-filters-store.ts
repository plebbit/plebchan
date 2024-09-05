import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterItem {
  text: string;
  enabled: boolean;
}

interface CatalogFiltersStore {
  showAdultBoards: boolean;
  setShowAdultBoards: (value: boolean) => void;
  showGoreBoards: boolean;
  setShowGoreBoards: (value: boolean) => void;
  showTextOnlyThreads: boolean;
  setShowTextOnlyThreads: (value: boolean) => void;
  filterText: string;
  setFilterText: (value: string) => void;
  filterItems: FilterItem[];
  setFilterItems: (items: FilterItem[]) => void; // New method to set all filter items at once
  saveAndApplyFilters: (items: FilterItem[]) => void; // Updated to accept items
}

const useCatalogFiltersStore = create(
  persist<CatalogFiltersStore>(
    (set, get) => ({
      showTextOnlyThreads: false,
      setShowTextOnlyThreads: (value: boolean) => set({ showTextOnlyThreads: value }),
      showAdultBoards: false,
      setShowAdultBoards: (value: boolean) => set({ showAdultBoards: value }),
      showGoreBoards: false,
      setShowGoreBoards: (value: boolean) => set({ showGoreBoards: value }),
      filterText: '',
      setFilterText: (value: string) => set({ filterText: value }),
      filterItems: [],
      setFilterItems: (items: FilterItem[]) => set({ filterItems: items }),
      saveAndApplyFilters: (items: FilterItem[]) => {
        set({ filterItems: items });
        console.log('Filters saved and applied:', items);
        // Example: refreshCatalog();
      },
    }),
    {
      name: 'catalog-filters-storage',
    },
  ),
);

export default useCatalogFiltersStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment } from '@plebbit/plebbit-react-hooks';

interface FilterItem {
  text: string;
  enabled: boolean;
  count: number;
  filteredCids: Set<string>;
  subplebbitCounts: Map<string, number>;
  subplebbitFilteredCids: Map<string, Set<string>>;
  hide: boolean;
  top: boolean;
}

interface CatalogFiltersStore {
  showTextOnlyThreads: boolean;
  setShowTextOnlyThreads: (value: boolean) => void;
  filterText: string;
  setFilterText: (value: string) => void;
  filterItems: FilterItem[];
  setFilterItems: (items: FilterItem[]) => void;
  saveAndApplyFilters: (items: FilterItem[]) => void;
  filter: ((comment: Comment) => boolean) | undefined;
  updateFilter: () => void;
  initializeFilter: () => void;
  filteredCount: number;
  filteredCids: Set<string>;
  incrementFilterCount: (filterIndex: number, cid: string, subplebbitAddress: string) => void;
  recalcFilteredCount: () => void;
  currentSubplebbitAddress: string | null;
  setCurrentSubplebbitAddress: (address: string | null) => void;
  getFilteredCountForCurrentSubplebbit: () => number;
  searchText: string;
  setSearchFilter: (text: string) => void;
  clearSearchFilter: () => void;
}

const useCatalogFiltersStore = create(
  persist<CatalogFiltersStore>(
    (set, get) => ({
      showTextOnlyThreads: false,
      setShowTextOnlyThreads: (value: boolean) => {
        set({ showTextOnlyThreads: value });
        get().updateFilter();
      },
      filterText: '',
      setFilterText: (value: string) => set({ filterText: value }),
      filterItems: [],
      filteredCount: 0,
      filteredCids: new Set<string>(),
      currentSubplebbitAddress: null,
      setCurrentSubplebbitAddress: (address: string | null) => set({ currentSubplebbitAddress: address }),
      searchText: '',
      setSearchFilter: (text: string) => {
        set({ searchText: text });
        get().updateFilter();
      },
      clearSearchFilter: () => {
        set({ searchText: '' });
        get().updateFilter();
      },
      setFilterItems: (items: FilterItem[]) => {
        const nonEmptyItems = items
          .filter((item) => item.text.trim() !== '')
          .map((item) => ({
            ...item,
            count: item.count || 0,
            filteredCids: item.filteredCids || new Set(),
            subplebbitCounts: item.subplebbitCounts || new Map(),
            subplebbitFilteredCids: item.subplebbitFilteredCids || new Map(),
            hide: item.hide ?? true,
            top: item.top ?? false,
          }));
        set({ filterItems: nonEmptyItems });
        get().recalcFilteredCount();
      },
      saveAndApplyFilters: (items: FilterItem[]) => {
        const nonEmptyItems = items
          .filter((item) => item.text.trim() !== '')
          .map((item) => ({
            ...item,
            count: item.count || 0,
            filteredCids: item.filteredCids || new Set(),
            subplebbitCounts: item.subplebbitCounts || new Map(),
            subplebbitFilteredCids: item.subplebbitFilteredCids || new Map(),
            hide: item.hide ?? true,
            top: item.top ?? false,
          }));
        set({
          filterItems: nonEmptyItems,
          filteredCids: new Set<string>(),
        });
        get().recalcFilteredCount();
        get().updateFilter();
      },
      filter: undefined,
      updateFilter: () => {
        set((state) => ({
          filter: (comment: Comment) => {
            if (!comment?.cid) return true;

            if (state.searchText.trim() !== '') {
              const searchPattern = state.searchText.toLowerCase();
              const title = comment?.title?.toLowerCase() || '';
              const content = comment?.content?.toLowerCase() || '';

              if (!title.includes(searchPattern) && !content.includes(searchPattern)) {
                return false;
              }
            }

            const { filterItems } = state;
            let shouldHide = false;
            for (let i = 0; i < filterItems.length; i++) {
              const item = filterItems[i];
              if (item.enabled && item.text.trim() !== '') {
                const pattern = item.text.toLowerCase();
                const title = comment?.title?.toLowerCase() || '';
                const content = comment?.content?.toLowerCase() || '';
                if (title.includes(pattern) || content.includes(pattern)) {
                  if (item.hide) {
                    shouldHide = true;
                  }
                }
              }
            }
            return !shouldHide;
          },
        }));
      },
      initializeFilter: () => {
        get().updateFilter();
      },
      incrementFilterCount: (filterIndex: number, cid: string, subplebbitAddress: string) => {
        set((state) => {
          const newFilterItems = [...state.filterItems];
          if (newFilterItems[filterIndex]) {
            const item = newFilterItems[filterIndex];

            const subplebbitFilteredCids = new Map(item.subplebbitFilteredCids);
            if (!subplebbitFilteredCids.has(subplebbitAddress)) {
              subplebbitFilteredCids.set(subplebbitAddress, new Set());
            }
            const cidSet = subplebbitFilteredCids.get(subplebbitAddress)!;

            if (!cidSet.has(cid)) {
              const newItemFilteredCids = new Set(item.filteredCids);
              newItemFilteredCids.add(cid);

              cidSet.add(cid);
              subplebbitFilteredCids.set(subplebbitAddress, cidSet);

              const subplebbitCounts = new Map(item.subplebbitCounts);
              const currentCount = subplebbitCounts.get(subplebbitAddress) || 0;
              subplebbitCounts.set(subplebbitAddress, currentCount + 1);

              newFilterItems[filterIndex] = {
                ...item,
                count: item.count + 1,
                filteredCids: newItemFilteredCids,
                subplebbitCounts,
                subplebbitFilteredCids,
              };

              return { filterItems: newFilterItems };
            }
          }
          return state;
        });

        get().recalcFilteredCount();
      },
      recalcFilteredCount: () => {
        set((state) => {
          const currentSubplebbit = state.currentSubplebbitAddress;
          if (!currentSubplebbit) return { filteredCount: 0 };

          let filteredCount = 0;
          for (const item of state.filterItems) {
            if (item.enabled && item.hide) {
              const subCount = item.subplebbitCounts?.get(currentSubplebbit) || 0;
              filteredCount += subCount;
            }
          }

          return { filteredCount };
        });
      },
      getFilteredCountForCurrentSubplebbit: () => {
        const state = get();
        const currentSubplebbit = state.currentSubplebbitAddress;
        if (!currentSubplebbit) return 0;

        let filteredCount = 0;
        for (const item of state.filterItems) {
          if (item.enabled && item.hide) {
            const subCount = item.subplebbitCounts?.get(currentSubplebbit) || 0;
            filteredCount += subCount;
          }
        }

        return filteredCount;
      },
    }),
    {
      name: 'catalog-filters-storage',
      partialize: (state) => {
        return {
          showTextOnlyThreads: state.showTextOnlyThreads,
          filterItems: state.filterItems.map((item) => ({
            text: item.text,
            enabled: item.enabled,
            hide: item.hide,
            top: item.top,
            subplebbitCounts: Array.from(item.subplebbitCounts || new Map()),
            subplebbitFilteredCids: Array.from((item.subplebbitFilteredCids || new Map()).entries()).map(([key, value]) => [key, Array.from(value)]),
          })),
        } as any;
      },
    },
  ),
);

useCatalogFiltersStore.getState().updateFilter();

export default useCatalogFiltersStore;

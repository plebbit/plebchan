import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment } from '@plebbit/plebbit-react-hooks';

interface FilterItem {
  text: string;
  enabled: boolean;
  count: number;
  filteredCids: Set<string>;
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
  incrementFilterCount: (filterIndex: number, cid: string) => void;
  recalcFilteredCount: () => void;
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
      setFilterItems: (items: FilterItem[]) => {
        const nonEmptyItems = items
          .filter((item) => item.text.trim() !== '')
          .map((item) => ({
            ...item,
            count: item.count || 0,
            filteredCids: item.filteredCids || new Set(),
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
      incrementFilterCount: (filterIndex: number, cid: string) => {
        set((state) => {
          const newFilterItems = [...state.filterItems];
          if (newFilterItems[filterIndex]) {
            const item = newFilterItems[filterIndex];
            if (!item.filteredCids.has(cid)) {
              const newItemFilteredCids = new Set(item.filteredCids);
              newItemFilteredCids.add(cid);
              newFilterItems[filterIndex] = {
                ...item,
                count: item.count + 1,
                filteredCids: newItemFilteredCids,
              };
              const newFilteredCount = newFilterItems.reduce((sum, filt) => (filt.hide ? sum + filt.count : sum), 0);
              return { filterItems: newFilterItems, filteredCount: newFilteredCount };
            }
          }
          return state;
        });
      },
      recalcFilteredCount: () => {
        set((state) => ({
          filteredCount: state.filterItems.reduce((sum, item) => (item.hide ? sum + item.count : sum), 0),
        }));
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
          })),
        } as any;
      },
    },
  ),
);

useCatalogFiltersStore.getState().updateFilter();

export default useCatalogFiltersStore;

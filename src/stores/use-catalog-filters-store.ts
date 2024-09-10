import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment } from '@plebbit/plebbit-react-hooks';
import { getCommentMediaInfo, getHasThumbnail } from '../lib/utils/media-utils';

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
  setFilterItems: (items: FilterItem[]) => void;
  saveAndApplyFilters: (items: FilterItem[]) => void;
  filter: ((comment: Comment) => boolean) | undefined;
  updateFilter: () => void;
  initializeFilter: () => void;
  filteredCount: number;
  resetFilteredCount: () => void;
}

const useCatalogFiltersStore = create(
  persist<CatalogFiltersStore>(
    (set, get) => ({
      showTextOnlyThreads: false,
      setShowTextOnlyThreads: (value: boolean) => {
        set({ showTextOnlyThreads: value, filteredCount: 0 });
        get().updateFilter();
      },
      showAdultBoards: false,
      setShowAdultBoards: (value: boolean) => set({ showAdultBoards: value }),
      showGoreBoards: false,
      setShowGoreBoards: (value: boolean) => set({ showGoreBoards: value }),
      filterText: '',
      setFilterText: (value: string) => set({ filterText: value }),
      filterItems: [],
      setFilterItems: (items: FilterItem[]) => {
        const nonEmptyItems = items.filter((item) => item.text.trim() !== '');
        set({ filterItems: nonEmptyItems });
      },
      saveAndApplyFilters: (items: FilterItem[]) => {
        const nonEmptyItems = items.filter((item) => item.text.trim() !== '');
        set({ filterItems: nonEmptyItems, filteredCount: 0 });
        get().updateFilter();
      },
      filter: undefined,
      updateFilter: () => {
        const filteredCids = new Set<string>();
        set((state) => ({
          filter: (comment: Comment) => {
            const { showTextOnlyThreads, filterItems } = state;

            const shouldShow = (() => {
              if (!showTextOnlyThreads && !getHasThumbnail(getCommentMediaInfo(comment), comment?.link)) {
                return false;
              }

              const title = comment?.title?.toLowerCase() || '';
              const content = comment?.content?.toLowerCase() || '';

              return !filterItems
                .filter((item) => item.enabled)
                .some((item) => {
                  const text = item.text.toLowerCase();
                  return title.includes(text) || content.includes(text);
                });
            })();

            if (!shouldShow && !filteredCids.has(comment.cid)) {
              filteredCids.add(comment.cid);
              set((state) => ({ filteredCount: state.filteredCount + 1 }));
            }

            return shouldShow;
          },
        }));
      },
      initializeFilter: () => {
        const { updateFilter } = get();
        updateFilter();
      },
      filteredCount: 0,
      resetFilteredCount: () => set({ filteredCount: 0 }),
    }),
    {
      name: 'catalog-filters-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.updateFilter();
        }
      },
    },
  ),
);

useCatalogFiltersStore.getState().updateFilter();

export default useCatalogFiltersStore;

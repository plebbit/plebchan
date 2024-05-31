import { create } from 'zustand';

interface SortingStore {
  sortType: 'active' | 'new';
  setSortType: (type: 'active' | 'new') => void;
}

const useSortingStore = create<SortingStore>((set) => ({
  sortType: 'active',
  setSortType: (type) => set({ sortType: type }),
}));

export default useSortingStore;

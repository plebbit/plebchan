import { create } from 'zustand';

interface HomeFiltersStore {
  showNsfwBoardsOnly: boolean;
  setShowNsfwBoardsOnly: (value: boolean) => void;
  showWorksafeBoardsOnly: boolean;
  setShowWorksafeBoardsOnly: (value: boolean) => void;
  useCatalog: boolean;
  setUseCatalog: (value: boolean) => void;
  showWorksafeContentOnly: boolean;
  setShowWorksafeContentOnly: (value: boolean) => void;
  showNsfwContentOnly: boolean;
  setShowNsfwContentOnly: (value: boolean) => void;
}

const useHomeFiltersStore = create<HomeFiltersStore>((set) => ({
  showNsfwBoardsOnly: localStorage.getItem('showNsfwBoardsOnly') === 'true' ? true : false,
  setShowNsfwBoardsOnly: (value: boolean) => {
    set({ showNsfwBoardsOnly: value });
    localStorage.setItem('showNsfwBoardsOnly', value.toString());
  },
  showWorksafeBoardsOnly: localStorage.getItem('showWorksafeBoardsOnly') === 'true' ? true : false,
  setShowWorksafeBoardsOnly: (value: boolean) => {
    set({ showWorksafeBoardsOnly: value });
    localStorage.setItem('showWorksafeBoardsOnly', value.toString());
  },
  useCatalog: localStorage.getItem('useCatalog') === 'true' ? true : false,
  setUseCatalog: (value: boolean) => {
    set({ useCatalog: value });
    localStorage.setItem('useCatalog', value.toString());
  },
  showWorksafeContentOnly: localStorage.getItem('showWorksafeContentOnly') === 'true' || localStorage.getItem('showWorksafeContentOnly') === null ? true : false,
  setShowWorksafeContentOnly: (value: boolean) => {
    set({ showWorksafeContentOnly: value });
    localStorage.setItem('showWorksafeContentOnly', value.toString());
  },
  showNsfwContentOnly: localStorage.getItem('showNsfwContentOnly') === 'true' ? true : false,
  setShowNsfwContentOnly: (value: boolean) => {
    set({ showNsfwContentOnly: value });
    localStorage.setItem('showNsfwContentOnly', value.toString());
  },
}));

export default useHomeFiltersStore;

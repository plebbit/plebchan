import { create } from 'zustand';

interface SelectedTextState {
  selectedText: string;
  setSelectedText: (text: string) => void;
  resetSelectedText: () => void;
}

const useSelectedTextStore = create<SelectedTextState>((set) => ({
  selectedText: '',
  setSelectedText: (text) => set({ selectedText: text }),
  resetSelectedText: () => set({ selectedText: '' }),
}));

export default useSelectedTextStore;

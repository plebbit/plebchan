import { create } from 'zustand';

interface CatalogStyleStore {
  imageSize: 'Small' | 'Large';
  setImageSize: (size: 'Small' | 'Large') => void;
  showOPComment: boolean;
  setShowOPComment: (value: boolean) => void;
}

const useCatalogStyleStore = create<CatalogStyleStore>((set) => ({
  imageSize: (localStorage.getItem('imageSize') as 'Small' | 'Large') || 'Small',
  setImageSize: (size: 'Small' | 'Large') => {
    set({ imageSize: size });
    localStorage.setItem('imageSize', size);
  },
  showOPComment: localStorage.getItem('showOPComment') === 'false' ? false : true,
  setShowOPComment: (value: boolean) => {
    set({ showOPComment: value });
    localStorage.setItem('showOPComment', value.toString());
  },
}));

export default useCatalogStyleStore;

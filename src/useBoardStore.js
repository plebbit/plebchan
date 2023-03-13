import { create } from 'zustand';

const useBoardStore = create((set) => ({
  bodyStyle: JSON.parse(localStorage.getItem('bodyStyle')) || {
    background: '#ffe url(/assets/fade.png) top repeat-x',
    color: 'maroon',
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  setBodyStyle: (bodyStyle) => {
    localStorage.setItem('bodyStyle', JSON.stringify(bodyStyle));
    set(() => ({ bodyStyle }));
  },
  
  selectedTitle: '',
  setSelectedTitle: (title) => set({ selectedTitle: title }),

  selectedAddress: '',
  setSelectedAddress: (address) => set({ selectedAddress: address }),

  selectedThread: '',
  setSelectedThread: (thread) => set({ selectedThread: thread }),

  selectedStyle: localStorage.getItem('selectedStyle') || 'Yotsuba',
  setSelectedStyle: (style) => {
    localStorage.setItem('selectedStyle', style);
    set({ selectedStyle: style });
  },

  captchaResponse: '',
  setCaptchaResponse: (response) => set({ captchaResponse: response }),
}));

export default useBoardStore;
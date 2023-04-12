import { create } from 'zustand';

const useGeneralStore = create((set) => ({
  bodyStyle: JSON.parse(localStorage.getItem('bodyStyle')) || {
    background: '#ffe url(/assets/fade.png) top repeat-x',
    color: 'maroon',
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  setBodyStyle: (bodyStyle) => {
    localStorage.setItem('bodyStyle', JSON.stringify(bodyStyle));
    set(() => ({ bodyStyle }));
  },

  captchaResponse: '',
  setCaptchaResponse: (response) => set({ captchaResponse: response }),

  challengesArray: [],
  setChallengesArray: (challengesArray) => set({ challengesArray }),

  defaultSubplebbits: [],
  setDefaultSubplebbits: (subplebbits) => set({ defaultSubplebbits: subplebbits }),

  isCaptchaOpen: false,
  setIsCaptchaOpen: (isOpen) => set({ isCaptchaOpen: isOpen }),

  isSettingsOpen: false,
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),

  pendingComment: '',
  setPendingComment: (comment) => set({ pendingComment: comment }),

  publishedComment: '',
  setPublishedComment: (comment) => set({ publishedComment: comment }),
  
  selectedAddress: '',
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  
  selectedReply: '',
  setSelectedReply: (reply) => set({ selectedReply: reply }),
  
  selectedStyle: localStorage.getItem('selectedStyle') || 'Yotsuba',
  setSelectedStyle: (style) => {
    localStorage.setItem('selectedStyle', style);
    set({ selectedStyle: style });
  },
  
  selectedThread: '',
  setSelectedThread: (thread) => set({ selectedThread: thread }),

  selectedTitle: '',
  setSelectedTitle: (title) => set({ selectedTitle: title }),

  showPostForm: false,
  setShowPostForm: (show) => set({ showPostForm: show }),

  showPostFormLink: true,
  setShowPostFormLink: (show) => set({ showPostFormLink: show }),

}));

export default useGeneralStore;
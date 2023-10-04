import { create } from 'zustand';

const useGeneralStore = create((set) => ({
  bodyStyle: JSON.parse(localStorage.getItem('bodyStyle')) || {
    background: '#ffe url(assets/fade.png) top repeat-x',
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

  defaultNsfwSubplebbits: [],
  setDefaultNsfwSubplebbits: (subplebbits) => set({ defaultNsfwSubplebbits: subplebbits }),

  deletePost: false,
  setDeletePost: (deletePost) => set({ deletePost }),

  editedComment: '',
  setEditedComment: (comment) => set({ editedComment: comment }),

  editedComments: {},
  setEditedComments: (comments) => set({ editedComments: comments }),

  feedCacheStates: {},
  setFeedCacheState: (address, isCached) =>
    set((prev) => ({
      feedCacheStates: {
        ...prev.feedCacheStates,
        [address]: isCached,
      },
    })),

  isAuthorDelete: false,
  setIsAuthorDelete: (isAuthorDelete) => set({ isAuthorDelete }),

  isAuthorEdit: false,
  setIsAuthorEdit: (isAuthorEdit) => set({ isAuthorEdit }),

  isCaptchaOpen: false,
  setIsCaptchaOpen: (isOpen) => set({ isCaptchaOpen: isOpen }),

  isEditModalOpen: false,
  setIsEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),

  canModerate: false,
  setCanModerate: (canModerate) => set({ canModerate }),

  isModerationOpen: false,
  setIsModerationOpen: (isOpen) => set({ isModerationOpen: isOpen }),

  isModEdit: false,
  setIsModEdit: (isModEdit) => set({ isModEdit }),

  isSettingsOpen: false,
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),

  moderatingCommentCid: '',
  setModeratingCommentCid: (cid) => set({ moderatingCommentCid: cid }),

  originalCommentContent: null,
  setOriginalCommentContent: (content) => set({ originalCommentContent: content }),

  pendingComment: '',
  setPendingComment: (comment) => set({ pendingComment: comment }),

  pendingCommentIndex: null,
  setPendingCommentIndex: (index) => set({ pendingCommentIndex: index }),

  publishedComment: '',
  setPublishedComment: (comment) => set({ publishedComment: comment }),

  replyQuoteCid: '',
  setReplyQuoteCid: (cid) => set({ replyQuoteCid: cid }),

  resolveCaptchaPromise: null,
  setResolveCaptchaPromise: (resolve) => set({ resolveCaptchaPromise: resolve }),

  selectedAddress: '',
  setSelectedAddress: (address) => set({ selectedAddress: address }),

  selectedParentCid: '',
  setSelectedParentCid: (parentCid) => set({ selectedParentCid: parentCid }),

  selectedShortCid: '',
  setSelectedShortCid: (shortCid) => set({ selectedShortCid: shortCid }),

  selectedStyle: localStorage.getItem('selectedStyle') || 'Yotsuba',
  setSelectedStyle: (style) => {
    localStorage.setItem('selectedStyle', style);
    set({ selectedStyle: style });
  },

  selectedText: '',
  setSelectedText: (text) => set({ selectedText: text }),

  selectedThread: '',
  setSelectedThread: (thread) => set({ selectedThread: thread }),

  selectedTitle: '',
  setSelectedTitle: (title) => set({ selectedTitle: title }),

  showPostForm: false,
  setShowPostForm: (show) => set({ showPostForm: show }),

  showPostFormLink: true,
  setShowPostFormLink: (show) => set({ showPostFormLink: show }),

  triggerInsertion: 0,
  setTriggerInsertion: (trigger) => set({ triggerInsertion: trigger }),
}));

export default useGeneralStore;

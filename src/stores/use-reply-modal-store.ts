import { create } from 'zustand';
import useSelectedTextStore from './use-selected-text-store';

interface ReplyModalState {
  showReplyModal: boolean;
  activeCid: string | null;
  threadCid: string | null;
  subplebbitAddress: string | null;
  scrollY: number;
  closeModal: () => void;
  openReplyModal: (parentCid: string, postCid: string, subplebbitAddress: string) => void;
}

const useReplyModalStore = create<ReplyModalState>((set, get) => ({
  showReplyModal: false,
  activeCid: null,
  threadCid: null,
  subplebbitAddress: null,
  scrollY: 0,

  closeModal: () => {
    // Reset selected text if you're using that store
    useSelectedTextStore.getState().resetSelectedText();
    set({
      showReplyModal: false,
      activeCid: null,
    });
  },

  openReplyModal: (parentCid, postCid, subplebbitAddress) => {
    // Get selected text
    const text = document.getSelection()?.toString();
    if (text) {
      useSelectedTextStore.getState().setSelectedText(`>${text}\n`);
    }

    // Handle mobile scrollY
    const isMobile = window.innerWidth <= 768; // Simple check, adjust as needed
    const scrollY = isMobile ? window.scrollY : 0;

    // Don't update if already open with different parent
    if (get().activeCid && get().activeCid !== parentCid) {
      return;
    }

    set({
      activeCid: parentCid,
      threadCid: postCid,
      showReplyModal: true,
      subplebbitAddress,
      scrollY,
    });
  },
}));

export default useReplyModalStore;

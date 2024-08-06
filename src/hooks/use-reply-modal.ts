import { useState } from 'react';
import useIsMobile from './use-is-mobile';
import useSelectedTextStore from '../stores/use-selected-text-store';

const useReplyModal = () => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeCid, setActiveCid] = useState<string | null>(null);
  const [threadCid, setThreadCid] = useState<string | null>(null);
  const { resetSelectedText, setSelectedText } = useSelectedTextStore();

  // on mobile, the css position is absolute instead of fixed, so we need to calculate the top position
  const isMobile = useIsMobile();
  const [scrollY, setScrollY] = useState<number>(0);

  const closeModal = () => {
    resetSelectedText();
    setActiveCid(null);
    setShowReplyModal(false);
  };

  const getSelectedText = () => {
    let text = document.getSelection()?.toString();
    text && setSelectedText(`>${text}\n`);
  };

  const openReplyModal = (parentCid: string, postCid: string) => {
    getSelectedText();

    if (isMobile) {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    }

    if (activeCid && activeCid !== parentCid) {
      return;
    }
    setActiveCid(parentCid);
    setThreadCid(postCid);
    setShowReplyModal(true);
  };

  return { activeCid, threadCid, closeModal, openReplyModal, scrollY, showReplyModal };
};

export default useReplyModal;

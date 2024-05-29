import { useState, useCallback } from 'react';
import useIsMobile from './use-is-mobile';

const useReplyModal = () => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeCid, setActiveCid] = useState<string | null>(null);

  // on mobile, the position is absolute instead of fixed, so we need to calculate the top position
  const isMobile = useIsMobile();
  const [scrollY, setScrollY] = useState<number>(0);

  const closeModal = useCallback(() => {
    setActiveCid(null);
    setShowReplyModal(false);
  }, []);

  const openReplyModal = useCallback(
    (cid: string) => {
      if (isMobile) {
        const currentScrollY = window.scrollY;
        setScrollY(currentScrollY);
      }
      if (activeCid && activeCid !== cid) {
        return;
      } else if (!activeCid) {
        setActiveCid(cid);
        setShowReplyModal(true);
      }
    },
    [activeCid, isMobile],
  );

  return { activeCid, closeModal, openReplyModal, scrollY, showReplyModal };
};

export default useReplyModal;

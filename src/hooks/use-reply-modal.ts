import { useState, useCallback } from 'react';

const useReplyModal = () => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeCid, setActiveCid] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setActiveCid(null);
    setShowReplyModal(false);
  }, []);

  const openReplyModal = useCallback(
    (cid: string) => {
      if (activeCid && activeCid !== cid) {
        closeModal();
        setTimeout(() => {
          setActiveCid(cid);
          setShowReplyModal(true);
        }, 0); // minimal timeout to allow for state reset
      } else if (!activeCid) {
        setActiveCid(cid);
        setShowReplyModal(true);
      }
    },
    [activeCid, closeModal],
  );

  return { showReplyModal, activeCid, openReplyModal, closeModal };
};

export default useReplyModal;

import { useState, useCallback } from 'react';

const useReplyModal = () => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeCid, setActiveCid] = useState<string | null>(null);

  const openReplyModal = useCallback(
    (cid: string) => {
      if (activeCid && activeCid !== cid) {
        closeModal(); // close modal if a different CID is clicked
        setActiveCid(cid);
        setShowReplyModal(true);
      } else if (!activeCid) {
        setActiveCid(cid);
        setShowReplyModal(true);
      }
    },
    [activeCid],
  );

  const closeModal = useCallback(() => {
    setActiveCid(null);
    setShowReplyModal(false);
  }, []);

  return { showReplyModal, activeCid, openReplyModal, closeModal };
};

export default useReplyModal;

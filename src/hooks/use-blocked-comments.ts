import { useMemo } from 'react';
import { Comment, useAccount, useComments } from '@plebbit/plebbit-react-hooks';

const useBlockedComments = (subplebbitAddress?: string): Comment[] => {
  const account = useAccount();

  const commentCids = useMemo(() => {
    return Object.entries(account.blockedAddresses)
      .filter(([address, isBlocked]) => {
        const isValidCommentCid = !address || /^Qm[a-zA-Z0-9]{44}$/.test(address);
        return isBlocked && isValidCommentCid;
      })
      .map(([address]) => address);
  }, [account]);

  const { comments } = useComments({ commentCids });

  const filteredComments = useMemo(() => {
    const validComments = comments.filter((comment): comment is Comment => comment !== undefined);

    if (!subplebbitAddress) {
      return validComments;
    }

    return validComments.filter((comment: Comment) => comment.subplebbitAddress === subplebbitAddress);
  }, [comments, subplebbitAddress]);

  return filteredComments;
};

export default useBlockedComments;

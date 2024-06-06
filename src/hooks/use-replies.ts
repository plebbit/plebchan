import { useMemo, useCallback } from 'react';
import { Comment, useAccountComments } from '@plebbit/plebbit-react-hooks';
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils';

const useReplies = (comment: Comment) => {
  // flatten all replies including nested ones from the original comment
  const flattenedReplies = useMemo(() => flattenCommentsPages(comment.replies), [comment.replies]);

  // generate a Set of CIDs from flattened replies for quick lookup
  const replyCids = useMemo(() => new Set(flattenedReplies.map((reply) => reply.cid)), [flattenedReplies]);

  // filter against the original comment's CID and all CIDs in flattened replies
  const filter = useCallback(
    (accountComment: Comment) => {
      return accountComment.parentCid === comment.cid || replyCids.has(accountComment.parentCid);
    },
    [comment.cid, replyCids],
  );

  const { accountComments } = useAccountComments({ filter });

  // the account's replies have a delay before getting published, so get them locally from accountComments instead
  const accountRepliesNotYetPublished = useMemo(() => {
    const replies = flattenedReplies || [];
    const replyCids = new Set(replies.map((reply: Comment) => reply?.cid));
    // filter out the account comments already in comment.replies, so they don't appear twice
    return accountComments.filter((accountReply) => !replyCids.has(accountReply?.cid));
  }, [flattenedReplies, accountComments]);

  const repliesAndNotYetPublishedReplies = useMemo(() => {
    const repliesSortedByPinnedAndTimestamp = [...accountRepliesNotYetPublished.reverse(), ...(flattenedReplies || [])];

    return repliesSortedByPinnedAndTimestamp.sort((a: Comment, b: Comment) => {
      // Sort by pinned status first, with pinned comments at the top
      if (a.pinned && !b.pinned) {
        return -1;
      } else if (!a.pinned && b.pinned) {
        return 1;
      }
      // If both are pinned or both are not pinned, sort by timestamp
      return a.timestamp - b.timestamp;
    });
  }, [flattenedReplies, accountRepliesNotYetPublished]);

  return repliesAndNotYetPublishedReplies;
};

export default useReplies;

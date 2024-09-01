import { useMemo, useCallback } from 'react';
import { Comment, useAccountComments } from '@plebbit/plebbit-react-hooks';
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils';

const useReplies = (comment: Comment) => {
  // flatten all replies including nested ones from the original comment
  const flattenedReplies = useMemo(() => flattenCommentsPages(comment?.replies), [comment?.replies]);

  // generate a Set of CIDs from flattened replies for quick lookup
  const replyCids = useMemo(() => new Set(flattenedReplies.map((reply) => reply?.cid)), [flattenedReplies]);

  const { accountComments } = useAccountComments();

  const getPostCid = useCallback(
    (accountComment: Comment, allComments: Comment[]): string | null => {
      if (accountComment.parentCid === comment?.cid) {
        return comment?.cid;
      }
      const parent = allComments.find((c) => c.cid === accountComment.parentCid);
      if (!parent) {
        return null;
      }
      return getPostCid(parent, allComments);
    },
    [comment?.cid],
  );

  const filteredAccountComments = useMemo(() => {
    const filterComments = (comments: Comment[]) => {
      return comments.filter((accountComment) => {
        const parentCid = accountComment.parentCid;
        if (parentCid === (comment?.cid || 'n/a') || replyCids.has(parentCid)) {
          return true;
        }
        return getPostCid(accountComment, comments) === comment?.cid;
      });
    };

    return filterComments(accountComments);
  }, [accountComments, comment?.cid, replyCids, getPostCid]);

  // the account's replies have a delay before getting published, so get them locally from accountComments instead
  const accountRepliesNotYetPublished = useMemo(() => {
    const replies = flattenedReplies || [];
    const replyCids = new Set(replies.map((reply: Comment) => reply?.cid));
    // filter out the account comments already in comment.replies, so they don't appear twice
    return filteredAccountComments.filter((accountReply) => !replyCids.has(accountReply?.cid));
  }, [flattenedReplies, filteredAccountComments]);

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

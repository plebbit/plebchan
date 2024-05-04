import { useMemo, useCallback } from 'react';
import { Comment, useAccountComments } from '@plebbit/plebbit-react-hooks';
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils';

const useRepliesAndAccountReplies = (comment: Comment) => {
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
    const repliesSortedByVotes = [
      // put the author's unpublished replies at the top, latest first (reverse)
      ...accountRepliesNotYetPublished.reverse(),
      // put the published replies after,
      ...(flattenedReplies || []),
    ];
    // sort by timestamp
    return repliesSortedByVotes.sort((a: Comment, b: Comment) => a.timestamp - b.timestamp);
  }, [flattenedReplies, accountRepliesNotYetPublished]);

  return repliesAndNotYetPublishedReplies;
};

export default useRepliesAndAccountReplies;
